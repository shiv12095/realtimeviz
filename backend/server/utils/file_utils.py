import json

class FileUtils:

    def __init__(self):
        pass

    @staticmethod
    def write_as_json_file(data, output_file):
        with open(output_file, 'w') as f:
            for line in data:
                f.write(json.dumps(line))
                f.write("\n")

    @staticmethod
    def append_to_json_file(data, output_file):
        with open(output_file, 'a+') as f:
            for line in data:
                f.write(json.dumps(line))
                f.write("\n")

    @staticmethod
    def get_file_name_as_json(file_name):
        return file_name + ".json";
