from flask import Flask, request
import numpy as np
import itertools

app = Flask(__name__)

def distance(v1, v2, include_background):
    '''
    Inputs:
        include_background: int; 0 for not including background info, 1 otherwise
        v1 and v2: dict; see value of class_feat dictionary below.
    Outputs: 
        A Distance metric between v1 and v2.
    '''
    complete = (v1["complete"] - v2["complete"])**2
    time = (v1["time"] - v2["time"])**2
    days = (v1["days"] - v2["days"])**2

    if include_background:
        race = 1 - (v1["race"] == v2["race"]) # 0 if same race, 1 if different
        gender = 1 - (v1["gender"] == v2["gender"]) # 0 if same, 1 if different. 
        age = (v1["age"] - v2["age"])**2
        upper = (v1["upper"] - v2["upper"])**2
        lower = (v1["lower"] - v2["lower"])**2
        return race + gender + age + upper + lower + complete + time + days
    else:
        return complete + time + days

@app.route("/", methods=['GET', 'POST'])
def hello():
    '''
    Takes in a UID, a class_list, and k, and returns the k nearest neighbours
    Inputs:
        class_feat: a dictionary of {
            UID: {
                "race": np.array; 6x1 one-hot vector representing the five races + blank
                "gender": np.array; 4x1 one-hot vector representing [male, female, neither, blank]
                "age": float; z-score of age
                "upper": float; z-score of # of upper div classes
                "lower": float; z-score of # of lower div classes
                "complete": float; z-score of # of completed assignments
                "time": float; z-score of time spent per assignment
                "days": float, z-score of days spent per assignment
            }
        }
        uid: int
        k: int
    Outputs: 
        result: dict; a dictionary with (1, UID), (2, UID)... values sorted by closeness
    '''
    uid = request.args.get('uid')
    k = int(request.args.get('k'))
    include_background = int(request.args.get('include_background'))
    class_feat = request.get_json()
    # Get the user's features
    self_feat = class_feat[uid]
    # Calculate a map of classmate to distance
    distance_map = {}
    for classmate, classmate_feat in class_feat.items():
        distance_map[classmate] = distance(self_feat, classmate_feat, include_background)
    # Sort the distance map, and take the top k neighbours
    distance_map = sorted(distance_map, key=distance_map.get)[1:k+1]
    return dict((str(i), j) for i, j in enumerate(distance_map))
