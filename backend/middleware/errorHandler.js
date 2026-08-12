const errorHandler = (err, req, res, next) => {
    if(err.name === 'CastError') {
        return res.status(404).send({ error: 'Resource not found' });
    } else if(err.name === 'ValidationError') {
        return res.status(400).send({ error: err.message });
    }
    console.error(err);
    return res.status(500).send({ error: 'Something went wrong!' });
}

module.exports = errorHandler;