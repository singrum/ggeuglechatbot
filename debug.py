import json
with open("json/all_words_dict.json", "r") as f:
    d = json.load(f)
print(d)