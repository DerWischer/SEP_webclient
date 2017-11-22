import MySQLdb
import dev_config
import json
import uuid

def get_db_user():
	return dev_config.DB_USER
def get_db_password():
	return dev_config.DB_PASSWORD

def get_database_name():
	""" Return the name of the database"""
	return "octoprint"

def create_database():
	db = get_database("")
	cursor = db.cursor()
	with open("database.sql", "r") as sql_file:
		for line in sql_file:
			cursor.execute(line)
	cursor.close()
	db.commit()

def get_database(db_name = get_database_name()):	
	""" Connects to the database and return the mysql object. Pass an empty string to create the database"""
	return MySQLdb.connect(host="localhost",   user=get_db_user(),  passwd=get_db_password(), db=db_name)

def getchildren(id):
	children = []
	db = get_database() 
	cur = db.cursor() 
	cur.execute("SELECT id FROM filesystem WHERE parent = %s",  [id])
	for row in cur.fetchall():
		children.append(row[0])
	return children

###START OF FILESYSTEM FUNCTIONS
    			
def get_file_system():
		db = get_database() 
		cur = db.cursor() 
		cur.execute("SELECT id, filename, file_ext, created, updated, type, parent FROM filesystem")
		# print the first and second columns 
		rows = {}    
		for row in cur.fetchall():
			children = []
			if row[5] == "folder":
				children = getchildren(row[0])
			rows[row[0]] = {
				"id":row[0],
				"name":row[1],
				"file_ext":row[2],
				"created":row[3],
				"updated":row[4],
				"owner":["mazen"],
				"type":row[5],
				"parent":row[6],
				"children": children
			} 
		return rows

def file_entry(id, name, path, ext, hashValue, size, created, updated , changehash, isfolder, parent):
	db = get_database()
	cur = db.cursor()
	try:
		type = "file"
		if isfolder:
    			type = "folder"
		sql = ('INSERT INTO filesystem VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)')
		cur.execute(sql, [id, name, path, ext, parent, hashValue, size, created, updated , changehash, type])
	except:
		pass
		#print("Can not add the same file again")
	cur.close()
	db.commit()

def get_folder_path_from_id(id):
	try:
		db = get_database() 
		cur = db.cursor() 
		cur.execute("SELECT path FROM filesystem WHERE id = %s LIMIT 1", [id])
		for row in cur.fetchone():
			return row
	except Exception as ex:
		print (ex)
		return None
	finally:
		cur.close()
		db.commit()


def create_folder(name, path, parent):
	try:
		db = get_database()
		cur = db.cursor()
		id = str(uuid.uuid4())
		cur.execute("INSERT INTO filesystem (id, filename, path, parent, type) VALUES (%s, %s, %s, %s, 'folder')", [id, name, path, parent])
		return True
	except Exception as ex:
		print (ex)
		return False
	finally:
		cur.close()
		db.commit()
	
	
def store_fileinformation(fileId, fileInfo):	
	resp_dict = json.loads(fileInfo)
    db = get_database()
    cur = db.cursor()
    try:
        sql = ('INSERT INTO fileinformation VALUES (%s, %s)')
        cur.execute(sql, [fileId,fileInfo])
        cur.close()
        db.commit()
        return("pass")
    except:
        return("failed")

def get_file_path(fileId):
		db = get_database()
		cur = db.cursor()
		cur.execute("SELECT path, filename, file_ext FROM filesystem where id = %s LIMIT 1",  [fileId])
		row = cur.fetchone()
		cur.close()
		return row[0],row[1], row[2]

def get_fileExt(fileId):
    db = get_database()
    cur = db.cursor()
    cur.execute("SELECT f.file_ext FROM   filesystem f where f.id = %s",  [fileId])
    count = cur.rowcount
    rows = {}
    if count == 0:
        return('error')
    for row in cur.fetchall():
    	return(row[0])
    cur.close()

#### END OF FILE SYSTEM

def authenticate_user(code):
		db = get_database()
		cur = db.cursor()
		user = cur.execute("SELECT id, name FROM users WHERE pin = %s", [code])
		rows = {}
		for row in cur.fetchall():
			rows = {
				"user_id":row[0],
				"name":row[1]
			}
		return rows

def update_account(id, name, pin):
	try:
		db = get_database()
		cur = db.cursor()
		cur.execute('INSERT INTO users VALUES (%s, %s) WHERE id = %s', [name, pin, id])
		db.commit()
		return True
	except:
		return False
	finally:
		cur.close()
		db.close()

def get_account_details(id):
	try:
		db = get_database()
		cur = db.cursor()
		cur.execute('SELECT name FROM users WHERE id = %s LIMIT 1', [id])
		details = {}
		for row in cur.fetchone():
			details["name"] = row
		return details
	except:
		raise Exception("User not found")
	finally:
		cur.close()
		db.close()