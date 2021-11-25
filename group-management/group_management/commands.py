import click
from http import HTTPStatus
from group_management.couchdb import Database, Server, User
from group_management import management, utils


@click.group(context_settings={ 'auto_envvar_prefix': 'MGMT' })
@click.option('-u', '--username', required=True)
@click.password_option(confirmation_prompt=False)
@click.argument('address')
@click.pass_context
def cli(ctx, username, password, address):
    ctx.ensure_object(Server)
    ctx.call_on_close(lambda: ctx.obj.close())
    ctx.obj.address = address
    ctx.obj.login(username, password)

@cli.command()
@click.argument('usersfile', type=click.File())
@click.argument('passwordsfile', type=click.File('w'))
@click.argument('initdata', type=click.File('rb'), nargs=-1)
@click.make_pass_decorator(Server)
def init(server, usersfile, passwordsfile, initdata):
    management.init_server(server, usersfile, passwordsfile, initdata)

@cli.command()
@click.option('--set',
              type=click.Choice(['true', 'nolb', 'false'],
              case_sensitive=False))
@click.make_pass_decorator(Server)
def maintenance(server, set):
    if set is not None:
        management.set_server_maintenance(server, set)
        click.secho('Set maintenance mode {}'.format(set), fg='green')
    else:
        result, mode = management.check_server_maintenance_mode(server)
        if result:
            click.secho('Server is up and running', fg='green')
        else:
            click.secho(
                'Server is in maintenance mode {}'.format(mode), fg='red'
            )

@cli.group()
@click.argument('name')
@click.make_pass_decorator(Server)
@click.pass_context
def db(ctx, server, name):
    ctx.ensure_object(Database)
    ctx.obj.name = name
    ctx.obj.server = server

@db.command()
@click.argument('initdata', type=click.File('rb'), nargs=-1)
@click.make_pass_decorator(Database)
def init(database, initdata):
    management.init_db(database, initdata=initdata)
    click.secho(
        'Sucessfully initialized database {}.'.format(database.name),
        fg='green'
    )

@cli.command()
@click.make_pass_decorator(Server)
def users(server):
    user_groups = management.users_list(server)
    stdout = click.get_text_stream('stdout')
    writer = utils.csv_writer(stdout)
    for user in user_groups:
        writer.writerow([
            user['username'],
            user['group'] if user['group'] is not None else '-'
        ])

@cli.group()
@click.argument('name')
@click.make_pass_decorator(Server)
@click.pass_context
def user(ctx, server, name):
    ctx.ensure_object(User)
    ctx.obj.name = name
    ctx.obj.server = server

@user.command()
@click.make_pass_decorator(User)
def create(user):
    password = management.create_user(user)
    click.secho(
        'Sucessfully created user {} with password {}.'.format(
            user.name, password
        ),
        fg='green'
    )

@user.command()
@click.argument('group', required=False)
@click.make_pass_decorator(User)
def group(user, group):
    if group is None:
        group = management.get_group(user)
        if group is not None:
            click.echo('User {} is in group {}.'.format(user.name, group))
        else:
            click.echo('User {} is not in a group.'.format(user.name))
    else:
        management.set_group(user, group)

@user.command()
@click.make_pass_decorator(User)
def resetpassword(user):
    password = management.reset_password(user)
    click.secho(
        'Sucessfully changed password of user {}.'.format(user.name),
        fg='green'
    )
    click.secho(
        'The new password is {}.'.format(password),
        fg='green'
    )
