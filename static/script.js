document.getElementById('amount').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, "");
    value = (Number(value) / 100).toFixed(2);
    value = value.replace('.', ',');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    e.target.value = value;
});

document.getElementById('generate-btn').addEventListener('click', function() {
    var amountField = document.getElementById('amount').value;
    var amount = parseFloat(amountField.replace('.', '').replace(',', '.'));

    if (amount <= 0 || isNaN(amount)) {
        alert('Por favor, insira um valor válido maior que zero.');
        return;
    }

    console.log('Valor a ser cobrado:', amount);
    document.getElementById('qr-code-display').innerHTML = '<p>Conectando ao sistema de pagamento...</p>';

    fetch('/processar_pagamento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            transaction_amount: amount,
            description: 'Pagamento de teste',
            payment_method_id: 'pix',
            payer: {
                email: 'cliente@exemplo.com'
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resposta do pagamento:', data);
        if (data.point_of_interaction && data.point_of_interaction.transaction_data) {
            var qrCodeUrl = data.point_of_interaction.transaction_data.qr_code;
            
            document.getElementById('qr-code-display').innerHTML = '<p>QR Code gerado com sucesso!</p>';
            
            var qrCodeDiv = document.createElement('div');
            document.getElementById('qr-code-display').appendChild(qrCodeDiv);
            
            new QRCode(qrCodeDiv, {
                text: qrCodeUrl,
                width: 128,
                height: 128
            });
            
        } else {
            document.getElementById('qr-code-display').innerHTML = '<p>Erro ao gerar o QR Code. Verifique o Access Token.</p>';
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        document.getElementById('qr-code-display').innerHTML = '<p>Erro ao conectar com o servidor.</p>';
    });
});

