const { writeData, getData, generateNewId } = require('../services/database-service');
const { formatCurrency } = require('../helpers/format-helper');

class AccountController {

    static async createAccount(req, res) {
        const data = getData();

        const { name, balance } = req.body;

        if (!name) {
            return res.status(400).send({
                message: "É necessário informar um nome"
            });
        }

        if (!balance || !parseFloat(balance)) {
            return res.status(400).send({
                message: "É necessário informar o valor da conta"
            });
        }

        data.push({
            id: generateNewId(),
            name,
            balance
        });

        await writeData(data);

        return res.status(201).send({
            message:"Conta criada com sucesso!"
        });
    }

    static async registerDeposit(req, res) {
        const data = getData();

        const { balance } = req.body;
        const { id } = req.params;

        if (!balance || !parseFloat(balance)) {
            return res.status(400).send({
                message: "É necessário informar o valor da conta"
            });
        }

        if(!id || !parseInt(id)) {
            return res.status(400).send({
                message: "É necessário informar o id da conta"
            });
        }

        let account = data.filter(account => parseInt(id) === account.id);

        if(!account || account.length <= 0) {
            return res.status(400).send({
                message: "A conta informada não existe"
            });
        }

        account = account.shift();
        const accountPosition = data.indexOf(account);
        
        account.balance += balance;
        data[accountPosition] = account;

        await writeData(data);

        return res.status(200).send({
            message: `Depósito de ${formatCurrency(balance)} para ${account.name} foi realizado com sucesso!`,
            accountBalance: account.balance
        });
    }

    static async registerWithdraw(req, res) {
        const data = getData();

        const { balance } = req.body;
        const { id } = req.params;

        if (!balance || !parseFloat(balance)) {
            return res.status(400).send({
                message: "É necessário informar o valor da conta"
            });
        }

        if(!id || !parseInt(id)) {
            return res.status(400).send({
                message: "É necessário informar o id da conta"
            });
        }

        let account = data.filter(account => parseInt(id) === account.id);

        if(!account || account.length <= 0) {
            return res.status(400).send({
                message: "A conta informada não existe"
            });
        }

        account = account.shift();

        if(account.balance < balance) {
            return res.status(400).send({
                message: "Saldo indisponível para saque"
            });
        }

        const accountPosition = data.indexOf(account);
        
        account.balance -= balance;
        data[accountPosition] = account;

        await writeData(data);

        return res.status(200).send({
            message: `Seu saque de ${formatCurrency(balance)} foi realizado com sucesso!`,
            accountBalance: account.balance
        });
    }

    static async checkBalance(req, res) {
        const data = getData();

        const { id } = req.params;

        if(!id || !parseInt(id)) {
            return res.status(400).send({
                message: "É necessário informar o id da conta"
            });
        }

        let account = data.filter(account => parseInt(id) === account.id);

        if(!account || account.length <= 0) {
            return res.status(400).send({
                message: "A conta informada não existe"
            });
        }

        account = account.shift();

        return res.status(200).send({
            message: `Seu seu saldo é de ${formatCurrency(account.balance)}`,
            accountBalance: account.balance
        });
    }

    static async deleteAccount(req, res) {
        let data = getData();

        const { id } = req.params;

        if(!id || !parseInt(id)) {
            return res.status(400).send({
                message: "É necessário informar o id da conta"
            });
        }

        let account = data.filter(account => parseInt(id) === account.id);

        if(!account || account.length <= 0) {
            return res.status(400).send({
                message: "A conta informada não existe"
            });
        }

        account = account.shift();
        const accountPosition = data.indexOf(account);

        delete data[accountPosition];

        data = data.filter(account => account);
        await writeData(data);

        return res.status(200).send({
            message: `A conta número ${account.id} foi removida com sucesso`
        });
    }
}

module.exports = AccountController;