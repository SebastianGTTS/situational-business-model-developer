from collections import defaultdict
from group_management import utils
from group_management.couchdb import CouchException, Database, User
from http import HTTPStatus
import re


class Expressions:
    GROUP = re.compile('^group[0-9]+$')


class ManagementException(Exception):

    def __init__(self, message):
        self.message = message


def check_server_maintenance_mode(server):
    return server.up()

def set_server_maintenance(server, value):
    server.maintenance(value)

def init_db(database, initdata=None, docs=None):
    if not Expressions.GROUP.match(database.name):
        raise ManagementException(
            'Database for group should have the form "group[0-9]+"'
        )
    database.create_if_not_exists()
    if initdata is not None and len(initdata) > 0:
        database.bulk_create(utils.import_docs(initdata))
    if docs is not None:
        database.bulk_create(docs)
    database.security({
        'members': { 'roles': ['_admin', database.name, 'mgmt_backup'] },
        'admins': { 'roles': ['_admin'] }
    })

def users_list(server):
    database = Database()
    database.server = server
    database.name = '_users'
    users = filter(
        lambda doc: doc['id'].startswith('org.couchdb.user:'),
        database.all_docs(include_docs=True)['rows']
    )
    user_groups = []
    for user in users:
        doc = user['doc']
        try:
            group = next(filter(Expressions.GROUP.match, doc['roles']))
        except StopIteration:
            group = None
        user_groups.append({
            'username': doc['name'],
            'group': group,
        })
    return user_groups

def create_user(user):
    password = utils.random_password()
    user.create_if_not_exists(password)
    return password

def set_group(user, group):
    if not Expressions.GROUP.match(group):
        raise ManagementException('Group has to have the form "group[0-9]+"')
    user.roles([group, 'mgmt_pwd'])

def get_group(user):
    info = user.info()
    try:
        return next(filter(Expressions.GROUP.match, info['roles']))
    except StopIteration:
        return None

def reset_password(user):
    password = utils.random_password()
    user.change_password(password)
    return password

def init_server(server, usersfile, passwordsfile, initdata):
    writer = utils.csv_writer(passwordsfile)
    users = utils.import_csv(usersfile)
    groups = defaultdict(list)
    docs = utils.import_docs(initdata)
    for i, (username, group) in enumerate(users):
        if not Expressions.GROUP.match(group):
            raise ManagementException(
                'Group has to have the form "group[0-9]+" in line {}'.format(
                    i + 1
                )
            )
        groups[group].append(username)
    for group, users in groups.items():
        database = Database()
        database.server = server
        database.name = group
        if not database.exists():
            init_db(database, docs=docs)
        for username in users:
            user = User()
            user.server = server
            user.name = username
            password = utils.random_password()
            try:
                user.create(password=password, roles=[group, 'mgmt_pwd'])
            except CouchException as e:
                if e.response.status_code == HTTPStatus.CONFLICT:
                    user.roles([group, 'mgmt_pwd'])
                    writer.writerow([username, group, '-'])
                else:
                    raise e
            else:
                writer.writerow([username, group, password])
