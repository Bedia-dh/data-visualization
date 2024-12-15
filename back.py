from flask import Flask, render_template, request, jsonify
import pandas as pd
import os

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Ensure the upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.endswith((".xls", ".xlsx")):
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(filepath)

        # Read the Excel file
        try:
            data = pd.read_excel(filepath)
            # Process data or convert to JSON for visualization
            result = data.to_dict(orient="records")
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return (
            jsonify({"error": "Invalid file type. Only Excel files are allowed."}),
            400,
        )


if __name__ == "__main__":
    app.run(debug=True)
