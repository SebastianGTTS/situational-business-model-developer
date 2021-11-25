from http import HTTPStatus
import requests
from urllib.parse import urljoin, quote


class CouchException(Exception):

    def __init__(self, response):
        self.response = response


class Server:

    def __init__(self):
        self.address = None
        self.session = requests.Session()

    def login(self, username, password):
        self.session.auth = (username, password)

    def up(self):
        url = urljoin(self.address, '_up/')
        response = self.session.get(url)
        if response.status_code == HTTPStatus.OK:
            return (True, response.json()['status'])
        if response.status_code == HTTPStatus.NOT_FOUND:
            return (False, response.json()['status'])
        raise CouchException(response)

    def maintenance(self, value):
        url = urljoin(
            self.address,
            '_node/_local/_config/couchdb/maintenance_mode/'
        )
        response = self.session.put(url, json=value)
        if response.status_code == HTTPStatus.OK:
            return
        raise CouchException(response)

    def close(self):
        self.session.close()


class Database:

    def __init__(self):
        self.name = None
        self.server = None

    def _get_endpoint_url(self, endpoint):
        return urljoin(
            urljoin(self.server.address, self.name + '/'), endpoint
        )

    def exists(self):
        url = urljoin(self.server.address, self.name)
        response = self.server.session.head(url)
        if response.status_code == HTTPStatus.OK:
            return True
        if response.status_code == HTTPStatus.NOT_FOUND:
            return False
        raise CouchException(response)

    def all_docs(self, include_docs=False):
        url = self._get_endpoint_url('_all_docs/')
        response = self.server.session.get(url, params={
            'include_docs': include_docs,
        })
        if response.status_code == HTTPStatus.OK:
            return response.json()
        raise CouchException(response)

    def create(self):
        url = urljoin(self.server.address, self.name)
        response = self.server.session.put(url)
        if (
            response.status_code == HTTPStatus.CREATED or
            response.status_code == HTTPStatus.ACCEPTED
        ):
            return
        raise CouchException(response)

    def create_if_not_exists(self):
        try:
            self.create()
        except CouchException as e:
            if e.response.status_code == HTTPStatus.PRECONDITION_FAILED:
                return
            else:
                raise e

    def create_document(self, doc):
        url = urljoin(self.server.address, self.name)
        response = self.server.session.post(url, json=doc)
        if (
            response.status_code == HTTPStatus.CREATED or
            response.status_code == HTTPStatus.ACCEPTED
        ):
            return
        raise CouchException(response)

    def update_document(self, doc):
        url = self._get_endpoint_url(quote(doc['_id']) + '/')
        response = self.server.session.put(url, json=doc)
        if (
            response.status_code == HTTPStatus.CREATED or
            response.status_code == HTTPStatus.ACCEPTED
        ):
            return
        raise CouchException(response)

    def get_document(self, id):
        url = self._get_endpoint_url(quote(id) + '/')
        response = self.server.session.get(url)
        if response.status_code == HTTPStatus.OK:
            return response.json()
        raise CouchException(response)

    def bulk_create(self, docs):
        url = self._get_endpoint_url('_bulk_docs/')
        for i in range(0, len(docs), 100):
            response = self.server.session.post(
                url, json={ 'docs': docs[i:i+100] }
            )
        if response.status_code == HTTPStatus.CREATED:
            return
        raise CouchException(response)

    def security(self, security):
        url = self._get_endpoint_url('_security/')
        response = self.server.session.put(url, json=security)
        if response.status_code == HTTPStatus.OK:
            return
        raise CouchException(response)


class User:

    def __init__(self):
        self.name = None
        self.database = Database()
        self.database.name = '_users'

    @property
    def id(self):
        return 'org.couchdb.user:{}'.format(self.name)

    @property
    def server(self):
        return self.database.server

    @server.setter
    def server(self, server):
        self.database.server = server

    def info(self):
        return self.database.get_document(self.id)

    def create(self, password, roles=[]):
        self.database.create_document({
          '_id': self.id,
          'name': self.name,
          'password': password,
          'roles': roles,
          'type': 'user'
        })

    def create_if_not_exists(self, *args, **kwargs):
        try:
            self.create(*args, **kwargs)
        except CouchException as e:
            if e.response.status_code == HTTPStatus.CONFLICT:
                return
            else:
                raise e

    def roles(self, roles=[]):
        current = self.database.get_document(self.id)
        current['roles'] = roles
        self.database.update_document(current)

    def change_password(self, password):
        current = self.database.get_document(self.id)
        current['password'] = password
        self.database.update_document(current)
