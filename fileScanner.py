import os
import time
from Database_Global import *
import uuid
import hashlib

def create_tables(conn):
    SQL = ('CREATE TABLE "filesystem" ("ID" TEXT PRIMARY KEY, "Filename" TEXT, "Path" TEXT, "File_Ext" TEXT, "HashValue" TEXT, "Size" INTEGER, "Create_Time" DATETIME,"Create_Date" DATETIME,"Modify_Time" DATETIME,"Modify_Date" DATETIME)')
    conn.execute(SQL)
    
def file_time_parse(File_Data, Creation=True): 
	#File_Data should be the os.stat data on the file, Creation dictates wether it is the creation time or the modify time
    if (Creation == True):
        File_Stamp = time.strftime("%Y/%m/%d|%H:%M:%S", time.gmtime(File_Data.st_ctime))
    else:
        File_Stamp = time.strftime("%Y/%m/%d|%H:%M:%S", time.gmtime(File_Data.st_mtime))
    File_Date = File_Stamp.split("|")[0]
    File_Time = File_Stamp.split("|")[1]
    return (File_Date, File_Time)

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
            CFile_Date, CFile_Time = file_time_parse(filestat)
            MFile_Date, MFile_Time = file_time_parse(filestat, False)
            HashValue = hashlib.md5(open(filepath,'rb').read()).hexdigest()
            file_info = {'Filename' : os.path.splitext(l)[0], 'Path' : path, 'HashValue':HashValue, 'Ext' : os.path.splitext(l)[1], 'Size' : filestat.st_size, 'Create_Time' : CFile_Time, 'Create_Date' : CFile_Date, 'Modify_Time' : MFile_Time, 'Modify_Date' : MFile_Date}
            dir_files.append(file_info)
    return dir_files

def main(path):
    print ("Scanning: %s" % path)
    if not os.path.exists(path):
        print ("Error: %s does not exist" % path)
        return
    db = Check_Database(path + os.path.sep + "filemap.sqlite", True)
    conn = db.cursor()
    conn.execute('SELECT * FROM sqlite_master WHERE type="table"')
    result = conn.fetchall()
    if (result):
        conn.execute('DELETE FROM filesystem')
    else:
        create_tables(conn)
    conn.close()
    db.commit()
    conn = DB.cursor()
    for Entry in filemap(path):
        sql = ('INSERT INTO filesystem VALUES ("%s", "%s", "%s", "%s", "%s", %s, "%s", "%s", "%s", "%s")' % (uuid.uuid4(), Entry['Filename'], Entry['Path'], Entry['Ext'], Entry['HashValue'], Entry['Size'], Entry['Create_Time'], Entry['Create_Date'], Entry['Modify_Time'], Entry['Modify_Date']))
        conn.execute(sql)
    db.commit()
    conn.close()
    print ("Scanning Complete")

main("/home/lemongrab/Documents")
