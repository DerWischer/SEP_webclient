import os
import time
import uuid
import hashlib
from time import mktime
from datetime import datetime
import math
import database_handler

def filemap(path):
    i = 0;
    Start_Dir = path
    dir_files = []
    for (path, dirs, files) in os.walk(path):
        for l in files:
            filepath = (path + os.path.sep + l)
            if not os.path.exists(filepath):
                continue
            filestat = os.stat(filepath)
            created = (math.floor(mktime(time.gmtime(filestat.st_ctime))))
            updated = (math.floor(mktime(time.gmtime(filestat.st_mtime))))
            hashvalue = hashlib.md5(open(filepath,'rb').read()).hexdigest() 
            file_info = {'name' : os.path.splitext(l)[0], 'path' : path, 'hashvalue':hashvalue, 'ext' : os.path.splitext(l)[1], 'size' : filestat.st_size, 'created':created, 'updated':updated}
            file_info['changehash'] = hashlib.sha512("%s%s%s%s" % (file_info['name'],file_info['ext'],file_info['path'],file_info['hashvalue'])).hexdigest()
            dir_files.append(file_info)
    return dir_files

def main(path):
    print ("Scanning: %s" % path)
    if not os.path.exists(path):
        print ("Error: %s does not exist" % path)
        return
    for entry in filemap(path):
        database_handler.file_entry(str(uuid.uuid4()), entry['name'], entry['path'], entry['ext'], entry['hashvalue'], entry['size'], entry['created'], entry['updated'],entry['changehash'])
    print ("Scanning complete")
main("/Users/Mizo/Documents/data")