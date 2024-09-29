const express = require('express');
const cors = require('cors');
const faker = require('faker');
const seedrandom = require('seedrandom');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/generate', (req, res) => {
    const { region, errorCount, seed, page } = req.body;
    const rng = seedrandom(`${seed}-${page}`);
    const data = [];

    for (let i = 0; i < 20; i++) {
        const name = faker.name.findName();
        const address = faker.address.streetAddress();
        const phone = faker.phone.phoneNumber();
        const record = {
            index: i + 1,
            identifier: rng.int32(),
            name,
            address,
            phone,
        };

        // Apply errors
        for (let j = 0; j < Math.floor(errorCount); j++) {
            const errorType = rng.int32() % 3; // Random error type
            // Apply error based on type
            switch (errorType) {
                case 0:
                    record.name = record.name.slice(0, rng.int32() % record.name.length) + record.name.slice((rng.int32() % record.name.length) + 1);
                    break;
                case 1:
                    const randomChar = faker.random.alpha({ count: 1 });
                    record.name = record.name.slice(0, rng.int32() % record.name.length) + randomChar + record.name.slice(rng.int32() % record.name.length);
                    break;
                case 2:
                    const swapIndex = rng.int32() % (record.name.length - 1);
                    record.name = record.name.slice(0, swapIndex) + record.name[swapIndex + 1] + record.name[swapIndex] + record.name.slice(swapIndex + 2);
                    break;
            }
        }

        data.push(record);
    }

    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
