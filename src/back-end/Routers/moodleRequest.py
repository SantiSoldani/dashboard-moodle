import requests
import os

TOKEN = os.getenv("MOODLE_TOKEN")
BASE_URL = os.getenv("MOODLE_BASE_URL") # http://localhost

def moodle_request(wsfunction, params={}):
    url = f"{BASE_URL}/webservice/rest/server.php?"
    base_params = {
        'wstoken':            TOKEN,
        'moodlewsrestformat': 'json',
        'wsfunction':         wsfunction,
    }
    base_params.update(params)

    try:
        response = requests.get(url, params=base_params)
        response.raise_for_status()  # Lanza error si hay un 4xx o 5xx
        data = response.json()
        
        # Moodle devuelve errores dentro del JSON tambien
        if isinstance(data, dict) and 'exception' in data:
            raise Exception(f"Moodle error: {data['message']}")
        
        return data

    except requests.exceptions.RequestException as e:
        print(f"Error de conexión: {e}")
        raise