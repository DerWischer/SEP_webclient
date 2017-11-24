import MySQLdb
import dev_config
import json
import uuid
import os

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


def store_fileinformation(fileId, fileInfo):
	try:
		json_arr = json.loads(fileInfo) 
		db = get_database()
		cur = db.cursor()
		for key in json_arr:
			sql = ('INSERT fileinformation (id, fileid, type, value) VALUES (UUID(),%s, %s,%s) ON DUPLICATE KEY UPDATE value=%s')
			cur.execute(sql, [fileId,key, json_arr[key], json_arr[key]])
		return True
	except Exception as ex:
		print (ex)
		return False
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

def get_file_information(fileId):
	'''Selects all file data information'''
	try:
		db = get_database()
		cur = db.cursor()
		cur.execute("SELECT types.name, fileinformation.value FROM types LEFT JOIN fileinformation ON types.id = fileinformation.type WHERE fileinformation.fileid = %s",  [fileId])
		data = {}
		for row in cur.fetchall():
			data[row[0]] = row[1]
		return data
	except Exception as ex:
		print (ex)
		return None
	finally:
		cur.close()
		db.commit()

def create_form_type_to_type_link(formId, type):
	try:
		db = get_database()
		cur = db.cursor()
		typeid = get_type_id(type)
		id = str(uuid.uuid4())
		cur.execute("INSERT INTO form_types_to_attributes (id, formid, typeid) VALUES (%s, %s, %s)", [id, formId, typeid])
		return id
	except Exception as ex:
		print (ex)
		return False
	finally:
		cur.close()
		db.commit()		

def create_form_type(name):
	try:
		db = get_database()
		cur = db.cursor()
		id = str(uuid.uuid4())
		cur.execute("INSERT INTO form_types (id, name) VALUES (%s, %s)", [id, name])
		return id
	except Exception as ex:
		print (ex)
		return False
	finally:
		cur.close()
		db.commit()	
    
def get_type_id(name):	
	'''Returns the id of the type, otherwise type is created and the generated id is returned'''
	try:
		db = get_database()
		cur = db.cursor()
		cur.execute("SELECT id FROM types WHERE name = %s LIMIT 1",  [name])
		id = None
		if cur.rowcount > 0:
			for row in cur.fetchone():
				id = row
		else:
			id = str(uuid.uuid4())
			cur.execute("INSERT into types (id, name) values (%s,%s)",[id,name])
		return id
	except Exception as ex:
		print (ex)
	finally:
		cur.close()
		db.commit()
           
def get_data(fileId):
	try:
		db = get_database()
		cur = db.cursor()
		cur.execute("""SELECT types.id, fileinformation.value
		FROM fileinformation LEFT JOIN types on types.id = fileinformation.type WHERE 
		fileinformation.fileid = %s""",  [fileId])
		json_dict = {}
		for row in cur.fetchall():
			json_dict[row[0]] = row[1]
		return json_dict
	except Exception as ex:
		print (ex)
		return "{}"
	finally:
		cur.close()
		db.close()

def get_types():
	try:
		db = get_database() 
		cur = db.cursor() 
		cur.execute("SELECT id, name FROM types")
		data = {}
		for row in cur.fetchall():
			data[row[0]] = row[1]
		return data
	except Exception as ex:
		print (ex)
		return None
	finally:
		cur.close()
		db.commit()

def advanced_search(searchParams, matchall):
	try:
		db = get_database()
		cur = db.cursor()
		sql = "SELECT fileinformation.fileid FROM fileinformation WHERE (fileinformation.type = %s AND fileinformation.value = %s)"
		for i in range(len(searchParams)-1):
			if matchall:
				sql += " AND (fileinformation.type = %s AND fileinformation.value = %s)"
			else:
				sql += " OR (fileinformation.type = %s AND fileinformation.value = %s)"	
		values = []
		for key in searchParams.keys():
			values.append(key)
			values.append(searchParams[key])
		cur.execute(sql, values);
		rows = []
		for row in cur.fetchall():
			rows.append(row)
		return rows
	except Exception as ex:
		print (ex)
		return None
	finally:
		cur.close()
		db.commit()

def form_type_exists(ext):
	try:
		db = get_database()
		cur = db.cursor()
		cur.execute("SELECT 1 FROM form_types WHERE name = %s",  [ext])
		if (cur.rowcount == 1):
			return True
		return False
	except Exception as ex:
		print (ex)
		return False
	finally:
		cur.close()
		db.commit()


def generate_alpaca(fileid, ext):
	if not form_type_exists(ext):
		with open(os.path.join("static", "alpacatemplates", "default.json"), 'r') as file:
			return json.loads(file.read())

	data = get_data(fileid)
	schema = {"type":"object"}
	properties = {}
	options = {"form":{}, "fields":{}}
	postRender= {}
	view = "bootstrap-edit-horizontal"
	try:
		db = get_database()
		cur = db.cursor()
		cur.execute("""SELECT types.id, types.name FROM form_types 
		LEFT JOIN form_types_to_attributes ON form_types_to_attributes.formid = form_types.id 
		LEFT JOIN types ON form_types_to_attributes.typeid = types.id 
		WHERE form_types.name = %s GROUP BY types.id""", [ext])
		for row in cur.fetchall():
			properties[row[0]] = {"title":row[1], "description":"", "type":"string"}
		schema["properties"] = properties
		form = {"data":data, "schema":schema, "options":options, "postRender":postRender, "view":view}
		return form
	except Exception as ex:
		print (ex)
		return None
	finally:
		cur.close()
		db.close()

def createjson(fileid):
	json_dict = {}
	json_dict2 = {}
	for row in cur.fetchall():
		json_dict[row[0]] = row[1]
		json_dict1 = {}
		json_dict1['Title'] =  row[0]
		json_dict1['Type'] = 'String'
		json_dict2[row[0]].append(json.dumps(json_dict1))
		print(json.dumps(json_dict1))
	json_prop={}
	json_prop.append(json.dumps(json_dict2))
	#print(json.dumps(json_prop))	
	return json.dumps(json_dict)

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
    db.commit()

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

def update_account(id, name):
	try:
		db = get_database()
		cur = db.cursor()
		cur.execute("UPDATE users SET name=%s WHERE id = %s", [name, str(id,'utf-8')])
		db.commit()
		return True
	except Exception as ex:
		print (ex)
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
