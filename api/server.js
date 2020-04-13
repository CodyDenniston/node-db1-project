const express = require('express');

const db = require('../data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
	db.select('*')
		.from('accounts')
		.then((account) => {
			res.status(200).json({ data: account });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error: error.message });
		});
});

server.get('/:id', (req, res) => {
	db('accounts')
		.where({ id: req.params.id })
		.first()
		.then((account) => {
			res.status(200).json({ data: account });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error: error.message });
		});
});

server.post('/', (req, res) => {
	const accountData = req.body;
	db('accounts')
		.insert(accountData, 'id')
		.then((ids) => {
			const id = ids[0];
			db('accounts')
				.where({ id })
				.first()
				.then((account) => {
					res.status(201).json({ data: account });
				});
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error: error.message });
		});
});

server.patch('/:id', (req, res) => {
	const changes = req.body;
	const { id } = req.params;
	db('accounts')
		.where({ id }) // remember to filter
		.update(changes)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({ message: 'update successful' });
			} else {
				res.status(404).json({ message: 'no accounts by that id found' });
			}
		});
});

server.delete('/:id', (req, res) => {
	db('accounts')
		.where({ id: req.params.id })
		.delete()
		.then(() => {
			res.status(200).json({ message: 'DELETED!!' });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error: error.message });
		});
});

module.exports = server;
