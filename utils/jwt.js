const jwt = require('jsonwebtoken');
const secret = 'djfnsjfnerfkjrer4egerg65re6gergerfzerg5erg6e2grg5rgreg2à @(fdjgj)bvnv,kzozrdkEFENVBCLFKGjfzfezkfz5488';

const randomXrsf = () => {
    return `ze/r${new Date().getTime()}/!:yiot${Math.random()*1000}/ips`;
}

module.exports = {
    sign : (userData) => {
        return jwt.sign({
                id: userData._id,
                firstName: userData.firstName,
                isAdmin : userData.isAdmin,
                xrsfToken : randomXrsf()
            },
            secret,
            {
                expiresIn: '5h'
            })
    },
    verify : (authorization) => {
        return new Promise((resolve , reject ) => {
            let token = authorization.split(' ')[1]
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(decoded);
                }
            });
        });
    }
}