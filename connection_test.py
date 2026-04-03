import pymongo
import certifi

# This is your connection string
uri = "mongodb+srv://vishwajeetmore2023comp_db_user:bn0NDGmSbgsFwhOa@cluster0.rqzijow.mongodb.net/"

try:
    print("Testing connection...")
    # We try with the 'certifi' bundle which fixes many Windows SSL errors
    client = pymongo.MongoClient(uri, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=5000)
    print("Databases:", client.list_database_names())
    print("\n✅ CONNECTION SUCCESSFUL!")
except Exception as e:
    print(f"\n❌ CONNECTION FAILED: {e}")
