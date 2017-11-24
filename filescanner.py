'''Module for scanning the filesystem'''
import os
import hashlib
from time import gmtime, mktime
import math
import uuid
import time
from pathlib import Path

FOLDER_TO_ID = {}
def scan_recursive(folder_path):
    ''' Scans recursively through a folder structure and creates a dictionary for each file '''
    print("Scanning: %s" % folder_path)
    if not os.path.exists(folder_path):
        raise FileNotFoundError("Error: %s does not exist" % folder_path)
    if not os.path.isdir(folder_path):
        raise Exception("path must be a valid folder %s" % folder_path)
    dir_files = []
    #insert root
    root_name = os.path.basename(os.path.normpath(folder_path))
    id = str(uuid.uuid4())
    file_info = {
        'id':id,
        'name': root_name,
        'path': folder_path,
        'hashvalue': None,
        'ext': None,
        'size': None,
        'created': None,
        'updated': None,
        'isfolder':True,
        'parent':None        
    }
    FOLDER_TO_ID[folder_path] = id
    dir_files.append(file_info)
    for (path, dirs, files) in os.walk(folder_path):
        for dirname in dirs:
            id = str(uuid.uuid4())
            folderpath = os.path.join(path, dirname)
            file_info = {
                'id':id,
                'name': dirname,
                'path': folderpath,
                'hashvalue': None,
                'ext': None,
                'size': None,
                'created': None,
                'updated': None,
                'isfolder':True,
                'parent':FOLDER_TO_ID[os.path.dirname(folderpath)],                
            }
            dir_files.append(file_info)
            FOLDER_TO_ID[folderpath] = id
        for filename in files:
            id = str(uuid.uuid4());
            filepath = os.path.join(path, filename)
            filestat = os.stat(filepath)
            file_info = {
                'id':id,
                'name': os.path.splitext(filename)[0],
                'path': filepath,
                'hashvalue': hashlib.md5(open(filepath, 'rb').read()).hexdigest(),
                'ext': os.path.splitext(filename)[1],
                'size': filestat.st_size,
                'created': math.floor(mktime(gmtime(filestat.st_ctime))),
                'updated': math.floor(mktime(gmtime(filestat.st_mtime))),
                'isfolder':False,
                'parent':FOLDER_TO_ID[os.path.dirname(filepath)]
            }            
            dir_files.append(file_info)
    print("Scanning complete")
    return dir_files

def generate_customer_file(customer_name):
    """ Generates a file with the specified name, the file extension 'customer', with the parent CUSTOMERS."""    
    fileId = str(uuid.uuid4())
    millis = int(round(time.time() * 1000))    
    timestamp = int(time.time())
    customer_file = {
        'id':fileId,
        'name': customer_name,
        'path': None,
        'hashvalue': None,
        'ext': None,
        'size': None,
        'created': timestamp,
        'updated': timestamp,
        'isfolder':False,
        'parent': None
    }    
    return customer_file

def get_file_stats(parentid, filepath, filename):    
    id = str(uuid.uuid4())
    filestat = os.stat(filepath)
    file_info = {
        'id':id,
        'name': os.path.splitext(filename)[0],
        'path': filepath,
        'hashvalue': hashlib.md5(open(filepath, 'rb').read()).hexdigest(),
        'ext': os.path.splitext(filename)[1],
        'size': filestat.st_size,
        'created': math.floor(mktime(gmtime(filestat.st_ctime))),
        'updated': math.floor(mktime(gmtime(filestat.st_mtime))),
        'isfolder':False,
        'parent':parentid
    }    
    return file_info
