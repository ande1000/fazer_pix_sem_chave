import os
import mercadopago
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

sdk = mercadopago.SDK("APP_USR-5736314269671526-062323-4c8cc89d1112ac6799a6d3")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/processar_pagamento', methods=['POST'])
def processar_pagamento():
    dados = request.json

    payment_data = {
        "transaction_amount": float(dados['transaction_amount']),
        "description": dados['description'],
        "payment_method_id": dados['payment_method_id'],
        "payer": {
            "email": dados['payer']['email']
        }
    }

    result = sdk.payment().create(payment_data)
    
    response_data = result.get("response")
    qr_code = None
    if response_data and "point_of_interaction" in response_data:
        qr_code = response_data["point_of_interaction"]["transaction_data"]["qr_code"]

    return jsonify({"response": response_data, "qr_code": qr_code}), result["status"]

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
