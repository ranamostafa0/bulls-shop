export const create = async ({ model, data = {} } = {}) => {
    return await model.create(data)

}

//Finders
export const findAll = async ({ model, filter = {}, select = "", populate = [], sort = {}, skip = 0, limit = 1000 } = {}) => {
    return await model.find(filter).select(select).populate(populate).sort(sort).skip(skip).limit(limit);
}

export const findOne = async ({ model, filter = {}, select = "", populate = [] } = {}) => {
    return await model.findOne(filter).select(select).populate(populate)
}

export const findById = async ({ model, id, select = "", populate = [] } = {}) => {
    return await model.findById(id).select(select).populate(populate)
}

//Update
export const findOneAndUpdate = async ({ model, filter = {}, data = {}, options = { runValidators: true, new: true }, select = "", populate = [] } = {}) => {
    return await model.findOneAndUpdate(filter, data, options).select(select).populate(populate);
}

export const findByIdAndUpdate = async ({ model, id = "", data = {}, options = { runValidators: true, new: true }, select = "", populate = [] } = {}) => {
    return await model.findByIdAndUpdate(id, data, options).select(select).populate(populate);
}

export const updateOne = async ({ model, filter = {}, data = {}, options = { runValidators: true } } = {}) => {
    return await model.updateOne(filter, data, options)

}

export const updateMany = async ({ model, filter = {}, data = {}, options = {} } = {}) => {
    return await model.updateMany(filter, data, options);
}


//Delete
export const findOneAndDelete = async ({ model, filter = {}, select = "", populate = [] } = {}) => {
    return model.findOneAndDelete(filter).select(select).populate(populate);
}

export const findByIdAndDelete = async ({ model, id = "", select = "", populate = [] } = {}) => {
    return await model.findByIdAndDelete(id).select(select).populate(populate);
}

export const deleteOne = async ({ model, filter = {} } = {}) => {
    return await model.deleteOne(filter);
}

export const deleteMany = async ({ model, filter = {} } = {}) => {
    return await model.deleteMany(filter);
}

