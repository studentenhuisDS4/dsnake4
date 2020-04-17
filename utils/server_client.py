import requests
import os
import pickle


class ServerClient(object):
    """
        Class to manage data from server concerning authentication and highscores.
    """

    SERVER_API_BASE = 'https://ds4.nl/api/v1/'

    SERVER_LOGIN = SERVER_API_BASE + 'auth-jwt/'
    SERVER_SNAKE_HIGHSCORES = SERVER_API_BASE + 'snake-highscore/'
    LOGIN_PICKLEFILE = "./data/token.pickle"
    LOGIN = None

    def __init__(self):
        login_token = None
        logged_in = None
        loaded_highscores = []

    def add_highscore(self, nickname, score):
        try:
            if self.logged_in:
                # Add authentication
                input_data = {'score': score, 'nickname': nickname}
                response = requests.post(
                    self.SERVER_SNAKE_HIGHSCORES + "add/",
                    headers=self.get_token_header(self.login_token),
                    json=input_data
                )
                if response.status_code == 200:
                    return None
                elif response.status_code == 401:
                    print(
                        "ERROR: server did not accept the login token provided (401 NOT_AUTH code)")
                else:
                    print(
                        "WARN: request was responded with unhandled response code for highscores, status-code: {} (response: {})"
                        .format(response.status_code, response))
            else:
                print("WARN: can't push snake highscores without successful login.")

        except Exception as e:
            print(
                "ERROR: exception occurred while pushing high-scores from server API: {}".format(e))
        return None

    def load_highscores(self):
        # Load snake highscores from the server API, but only if logged in.
        try:
            if self.logged_in:
                # Add authentication
                response = requests.get(
                    self.SERVER_SNAKE_HIGHSCORES, headers=self.get_token_header(self.login_token))

                if response.status_code == 200:
                    loaded_highscores = response.json()
                    return loaded_highscores
                elif response.status_code == 401:
                    print(
                        "ERROR: server did not accept the login token provided (401 NOT_AUTH code)")
                else:
                    print(
                        "WARN: request was responded with unhandled response code for highscores, status-code: {} (response: {})"
                        .format(response.status_code, response))
            else:
                print("WARN: can't retrieve snake highscores without successful login.")

        except Exception as e:
            print(
                "ERROR: exception occurred while fetching high-scores from server API: {}".format(e))
        return None

    def authenticate(self, username=None, password=None):
        # Always do authenticate, if the asker requests it.
        if username is not None and password is not None:
            self.LOGIN = {
                'username-or-email': username,
                'password': password
            }
            result = requests.post(self.SERVER_LOGIN, data=self.LOGIN)
            try:
                json_result = result.json()
                if 'token' in json_result.keys():
                    self.login_token = result.json()['token']
                if result.status_code == 200:
                    if self.dump_token_pickle(token=self.login_token) is None:
                        print(
                            "ERROR: authentication could not save token as pickle. Another error must have occurred.")
                    else:
                        self.logged_in = True
                        print("INFO: Authentication saved for next start.")
                elif result.status_code == 401:
                    print(
                        "ERROR: authentication failed, wrong credentials. Deleting token, if any.")
                    self.clean_signin()
                elif result.status_code == 500:
                    print("ERROR: authentication failed, internal server error.")
                else:
                    print(
                        "ERROR: authentication failed, possibly a connection failure.")

                return result.status_code == 200
            except Exception as e:
                raise e
        else:
            signin_result = self.signin_token()
            if not signin_result:
                print("Auto-signin failed: we need to trigger login this in GUI!")
                return False
            else:
                print("Auto-signin success.")
                return True

    def signin_token(self):
        # Avoids sign-in with credentials, just by token from a file.
        return self.load_token_pickle()

    def dump_token_pickle(self, token):
        # Should dump a token to file.
        try:
            self.ensure_folder_exists(self.LOGIN_PICKLEFILE)
            tokenfile = open(self.LOGIN_PICKLEFILE, 'ab')
            pickle.dump(token, tokenfile)
            tokenfile.close()
            return True
        except Exception as e:
            print("ERROR: exception while storing login token as pickle file.")
            return None

    def load_token_pickle(self, ):
        # Should load token or return None if not found (read with binary mode rb).
        try:
            self.logged_in = None
            if os.path.isfile(self.LOGIN_PICKLEFILE) and os.path.getsize(self.LOGIN_PICKLEFILE) == 0:
                print("WARN: removed empty pickle file.")
                os.remove(self.LOGIN_PICKLEFILE)

            if os.path.isfile(self.LOGIN_PICKLEFILE):
                tokenfile = open(self.LOGIN_PICKLEFILE, 'rb')
                pickle_result = pickle.load(tokenfile)
                tokenfile.close()

                if pickle_result is not None:
                    self.login_token = pickle_result
                    self.logged_in = True
                else:
                    # Unexpected scenario
                    print(
                        "WARN: pickle loading result was None, which poses a problem in retrieving a token.")
                    self.logged_in = False
            return self.logged_in
        except Exception as e:
            print("ERROR: exception swallowed on LOGIN PICKLE loading: {}".format(e))

        return -1

    def clean_signin(self):
        if os.path.isfile(self.LOGIN_PICKLEFILE):
            os.remove(self.LOGIN_PICKLEFILE)
        self.logged_in = None
        self.login_token = None

    def get_token_header(self, provided_token):
        return {'Authorization': 'Bearer ' + provided_token}

    def ensure_folder_exists(self, filename):
        os.makedirs(os.path.dirname(filename), exist_ok=True)
