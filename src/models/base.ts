const baseSchema = {
    updatedAt: { type: Date, required: true, default: Date.now },
    createdAt: { type: Date, required: true, default: Date.now },
    iSdeleted: { type: Boolean, default: false, select: false },
    iSdisabled: { type: Boolean, default: false, select: false },
}

export default baseSchema;
