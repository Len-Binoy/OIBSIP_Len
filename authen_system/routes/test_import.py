# test_import.py
try:
    from flask_login import LoginManager
    print("flask_login imported successfully!")
except ImportError as e:
    print(f"Import error: {e}") 