import csv
import json
import string
import secrets


def import_docs(buffers):
    docs = []
    for buffer in buffers:
        docs.extend(json.load(buffer))
    return docs

def import_csv(buffer):
    return csv.reader(buffer)

def csv_writer(buffer):
    return csv.writer(buffer)

# https://docs.python.org/3/library/secrets.html#recipes-and-best-practices
def random_password():
    letters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(letters) for i in range(12))
