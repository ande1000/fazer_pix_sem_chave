import os
import mercadopago
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

sdk = mercadopago.SDK("APP_USR-5736314269671526-062323-4c8cc89d1112ac6799a6d37e85009840-750814888")

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
    
    return jsonify(result["response"]), result["status"]

if __name__ == '__main__':
    app.run(port=8080)