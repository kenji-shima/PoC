import laspy
import json

def las_to_json(las_file_path, json_file_path):
    # Read the LAS file
    las = laspy.read(las_file_path)

    # Extract point data
    points = {
        "x": list(las.x),  # Convert to a list
        "y": list(las.y),  # Convert to a list
        "z": list(las.z),  # Convert to a list
        # Add more attributes as needed
    }

    # Write the points data to a JSON file
    with open(json_file_path, "w") as json_file:
        json.dump(points, json_file)

# Usage example
las_file_path = "/users/kenjishima/downloads/01ke9812_org.las"
json_file_path = "/users/kenjishima/downloads/01ke9812_org.json"
las_to_json(las_file_path, json_file_path)