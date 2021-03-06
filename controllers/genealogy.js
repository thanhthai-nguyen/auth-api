const User = require('../models/user');
const Family = require('../models/family');
const Author = require('../models/authorTree');
const Tree = require('../models/genealogy');


const {ObjectId} = require('mongodb');



// @route POST api/user/{id}
// @desc  Create a new Geanealogy Tree
// @access Public
exports.authorTree = async function (req, res) {
    try {
        const userId = req.user._id;

        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
        // res.redirect('/');


        const auth = new Author({
            userId: userId,
            treename: req.body.treename,
            author: req.body.author,
            address: req.body.address,
            numGen: 1,
            numMem: 1,
            countParents: 0,
            countChilds: 0,
            profileImage: req.body.imgauth,
          });
    
        //Save author of tree
        await auth.save();

        const root = new Tree({
            userId: userId,
            authId: auth._id,
            parentId: auth._id,
            firstname: req.body.firstname,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            nickname: req.body.nickname,
            sex: req.body.sex,
            numphone: req.body.numphone,
            dob: req.body.dob,
            domicile: req.body.domicile,
            dod: req.body.dod,
            burialplace: req.body.burialplace,
            profileImage: req.body.imgroot,
            rank: req.body.rank,
            sort: 0,
          });
    
        // Save root node 
        await root.save();
        

        res.status(200).json({ auth, root});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// @route POST api/user/{id}
// @desc  Create a new Leaf Genealogy Tree  
// @access Public
exports.childs = async function (req, res) {
    try {
        const userId = req.user._id;
        const parentId = req.body.parentId;

        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
        // res.redirect('/');

        const parent = await Tree.findById(parentId);
        const auth = await Author.findById(req.body.authId);

        if (!parent) {
            return res.status(401).json({message: 'The parent node does not exist'});
        }


        const leaf = new Tree({
            userId: userId,
            authId: req.body.authId,
            parentId: parentId,
            firstname: req.body.firstname,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            nickname: req.body.nickname,
            sex: req.body.sex,
            numphone: req.body.numphone,
            dob: req.body.dob,
            domicile: req.body.domicile,
            dod: req.body.dod,
            burialplace: req.body.burialplace,
            profileImage: req.body.profileImage,
            rank: req.body.rank,
            sort: 0,
          });
    
        // Save root node 
        await leaf.save();

        // leaf.sort = auth.countParents + 1;
        // await leaf.save();

        auth.numMem = auth.numMem + 1;
        // auth.countChilds = leaf.sort;
        
        await auth.save();


        return res.status(200).json({leaf, message: 'Genealogy has been updated'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// @route POST api/user/{id}
// @desc  Create a new Leaf Genealogy Tree is Spouse
// @access Public
exports.spouses = async function (req, res) {
    try {
        const userId = req.user._id;
        const spouseId = req.body.spouseId;

        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
        // res.redirect('/');

        const spouse = await Tree.findById(spouseId);

        if (!spouse) {
            return res.status(401).json({message: 'The spouse node does not exist'});
        }

        const leaf = new Tree({
            userId: userId,
            spouseId: spouseId,
            authId: req.body.authId,
            isSpouse: true,
            firstname: req.body.firstname,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            nickname: req.body.nickname,
            numphone: req.body.numphone,
            sex: req.body.sex,
            dob: req.body.dob,
            domicile: req.body.domicile,
            dod: req.body.dod,
            burialplace: req.body.burialplace,
            profileImage: req.body.profileImage,
            rank: req.body.rank,
            sort: 0,
          });
    
        // Save root node 
        await leaf.save();

        const auth = await Author.findById(req.body.authId);

        auth.numMem = auth.numMem + 1;
        
        await auth.save();

        return res.status(200).json({leaf, message: 'Genealogy has been updated'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// @route POST api/user/{id}
// @desc  Create a new Leaf Genealogy Tree is Spouse
// @access Public
exports.parents = async function (req, res) {
    try {
        const userId = req.user._id;
        const childId = req.body.childId;

        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
        // res.redirect('/');

        const child = await Tree.findById(childId);

        if (!child) {
            return res.status(401).json({message: 'The node does not exist'});
        }

        const leaf = new Tree({
            userId: userId,
            parentId: req.body.authId,
            authId: req.body.authId,
            firstname: req.body.firstname,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            nickname: req.body.nickname,
            numphone: req.body.numphone,
            sex: req.body.sex,
            dob: req.body.dob,
            domicile: req.body.domicile,
            dod: req.body.dod,
            burialplace: req.body.burialplace,
            profileImage: req.body.profileImage,
            rank: req.body.rank,
          });

        
        child.parentId =leaf._id;

        await child.save();

        const auth = await Author.findById(req.body.authId);

        leaf.sort = auth.countParents - 1;
        // Save root node 
        await leaf.save();

        auth.numMem = auth.numMem + 1;
        auth.countParents = leaf.sort;
        
        await auth.save();

        return res.status(200).json({leaf, message: 'Genealogy has been updated'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};



// @route PUT api/user/{id}
// @desc Update Leaf Genealogy 
// @access Public
exports.leafUpdate = async function (req, res) {
    try {
        const update = req.body;
        const leafId = req.body.leafId;
        
        
        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
       // res.redirect('/');

        const leaf = await Tree.findByIdAndUpdate( {_id: ObjectId(leafId)}, {$set: update}, {new: true});
        
        await leaf.save();
        //if there is no image, return success message
        if (!req.file) {
            //console.log('User '+ user.email +' updated profile');
            return res.status(200).json({leaf, message: 'Genealogy has been updated'});
        }
        
        // There is image
        const leaf_ = await Tree.findByIdAndUpdate( {_id: ObjectId(leafId)}, {$set: {profileImage: req.file.filename}}, {new: true});
        //console.log('User '+ user_.email +' uploaded image');

        return res.status(200).json({leaf_, message: 'Genealogy has been updated'});

    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
};


// @route POST api/user/{id}
// @desc GET one Leaf Genealogy Tree by ID
// @access Public
exports.leafShowOne = async function (req, res) {
    try {
        const leafId = req.body.leafId;
        
        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
       // res.redirect('/');

        const leaf = await Tree.findById( {_id: ObjectId(leafId)});

        if (!leaf) return res.status(401).json({message: 'There are no info to display'});

        res.status(200).json({leaf});
    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
};


// @route POST api/user/{id}
// @desc GET ALL Leaf Genealogy Tree of Author
// @access Public
exports.leafShowAll = async function (req, res) {
    try {
        const authId = req.body.authId;
        
        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
       // res.redirect('/');

        const leaf = await Tree.find({authId: authId}).sort({sort: 1});

        if (!leaf) return res.status(401).json({message: 'There are no info to display'});

        res.status(200).json({leaf});
    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
};


// @route POST api/user/{id}
// @desc GET ALL Leaf Genealogy Tree of Parent Node
// @access Public
exports.leafShow = async function (req, res) {
    try {
        const parentId = req.body.parentId;
        
        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
       // res.redirect('/');

        const leaf = await Tree.find({parentId: parentId});

        if (!leaf) return res.status(401).json({message: 'There are no info to display'});

        res.status(200).json({leaf});
    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
};

// @route POST api/user/{id}
// @desc GET ALL Leaf Spouse Genealogy Tree of Parent Node
// @access Public
exports.leafParentShow = async function (req, res) {
    try {
        const childId = req.body.childId;
        
        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
       // res.redirect('/');

        const leafparent = await Tree.find({childId: childId});

        if (!leafparent) return res.status(401).json({message: 'There are no info to display'});

        res.status(200).json({leafparent});
    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
};

// @route POST api/user/{id}
// @desc GET ALL Leaf Spouse Genealogy Tree of Parent Node
// @access Public
exports.leafSpouseShow = async function (req, res) {
    try {
        const spouseId = req.body.spouseId;
        
        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
       // res.redirect('/');

        const leafspouse = await Tree.find({spouseId: spouseId});

        if (!leafspouse) return res.status(401).json({message: 'There are no info to display'});

        res.status(200).json({leafspouse});
    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
};




// @route PUT api/user/{id}
// @desc Update Author Genealogy Tree 
// @access Public
exports.authorUpdate = async function (req, res) {
    try {
        const update = req.body;
        const authId = req.body.authId;
        
        
        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
       // res.redirect('/');

        const auth = await Author.findByIdAndUpdate( {_id: ObjectId(authId)}, {$set: update}, {new: true});
         
        //if there is no image, return success message
        if (!req.file) {
            //console.log('User '+ user.email +' updated profile');
            return res.status(200).json({auth, message: 'Genealogy has been updated'});
        }
        
        // There is image
        const auth_ = await Author.findByIdAndUpdate( {_id: ObjectId(authId)}, {$set: {profileImage: req.file.filename}}, {new: true});
        //console.log('User '+ user_.email +' uploaded image');

        return res.status(200).json({auth_, message: 'Genealogy has been updated'});

    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
};

// @route POST api/user/{id}
// @desc GET one Author Genealogy Tree by ID
// @access Public
exports.authShowOne = async function (req, res) {
    try {
        const authId = req.body.authId;
        
        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
       // res.redirect('/');

        const auth = await Author.findById( {_id: ObjectId(authId)});

        if (!auth) return res.status(401).json({message: 'There are no info to display'});

        res.status(200).json({auth});
    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
};


// @route GET api/user/{id}
// @desc GET ALL Author Genealogy Tree by ID
// @access Public
exports.authShowAll = async function (req, res) {
    try {
        const userId = req.user._id;
        
        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
       // res.redirect('/');

        const auth = await Author.find({userId: userId});

        if (!auth) return res.status(401).json({message: 'There are no info to display'});

        res.status(200).json({auth});
    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
};

// @route DELETE api/user/{id}
// @desc Delete one Genealogy Tree
// @access Public
exports.destroyTree = async function (req, res) {
    try {
        const authId = req.body.authId;

        //Make sure the passed id is that of the logged in user
        //if (user_id.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to delete this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to delete this data."});

        await Tree.deleteMany({ authId: authId });

        await Author.findByIdAndDelete({_id: ObjectId(authId)});

        res.status(200).json({message: 'The Genealogy Tree has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// @route DELETE api/user/{id}
// @desc Delete one Genealogy Tree
// @access Public
exports.destroyLeaf = async function (req, res) {
    try {
        const leafId = req.body.leafId;

        //Make sure the passed id is that of the logged in user
        //if (user_id.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to delete this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to delete this data."});

        const leaf = await Tree.findOne({parentId: leafId});
        
        //console.log(leaf);
        if (leaf) return res.status(401).json({message: 'Cannot be deleted because this node has branches'});

        const leafspouse = await Tree.findOne({spouseId: leafId});
        //console.log(leafspouse);
        if (leafspouse) return res.status(401).json({message: 'Cannot be deleted because this node has branches'});


        const leaf_ = await Tree.findById({_id: leafId});
        
        const auth = await Author.findById(ObjectId(leaf_.authId));

        if (leaf_.sort < 0)  {
            auth.countParents =auth.countParents + 1;
        }
        auth.numMem = auth.numMem - 1;
        
        await auth.save();

        await Tree.findByIdAndDelete({_id: ObjectId(leafId)});

        res.status(200).json({message: 'The Leaf Genealogy Tree has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};



// @route GET api/user/{id}
// @desc GET ALL Users linked with Family 
// @access Public
exports.friends = async function (req, res) {
    try {
        const userId = req.user._id;
        
        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
       // res.redirect('/');

        const friends = await Family.find({email: req.user.email}, 'userId')
                                    .populate({
                                        path: "userId",
                                        select: "email username numphone profileImage",
                                        model: User,
                                    });

        if (!friends) return res.status(401).json({message: 'There are no info to display'});


        res.status(200).json({friends});
    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
};


// @route GET api/user/{id}
// @desc GET ALL Author Genealogy Tree isPublish by ID 
// @access Public
exports.publicGenealogy = async function (req, res) {
    try {
        const userId = req.body.userId;
        
        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
       // res.redirect('/');

        const auth = await Author.find({userId: userId, isPublish: true});

        if (!auth) return res.status(401).json({message: 'There are no info to display'});

        res.status(200).json({auth});
    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
};



// @route POST api/user/{id}
// @desc Share the Genealogy
// @access Public
exports.shareGenealogy = async function (req, res) {
    try {
        const userId = req.user._id;
        const authId = req.body.authId;
        
        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
       // res.redirect('/');

        const auth = await Author.findById( {_id: ObjectId(authId)});

        if (!auth) return res.status(401).json({message: 'There are no info to display'});

        auth.isPublish = true;

        await auth.save();

        res.status(200).json({auth});
    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
};



// @route POST api/user/{id}
// @desc Remove Share the Genealogy
// @access Public
exports.removeShareGenealogy = async function (req, res) {
    try {
        const userId = req.user._id;
        const authId = req.body.authId;
        
        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
       // res.redirect('/');

        const auth = await Author.findById( {_id: ObjectId(authId)});

        if (!auth) return res.status(401).json({message: 'There are no info to display'});

        auth.isPublish = false;

        await auth.save();

        res.status(200).json({auth});
    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
};


// @route GET api/user/{id}
// @desc GET ALL Author Tree linked with numphone of Node 
// @access Public
exports.numphoneLink = async function (req, res) {
    try {
        const userId = req.user._id;
        
        //Make sure the passed id is that of the logged in user
        //if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
        if (!req.isAuthenticated()) return res.status(401).json({message: "Sorry, you don't have the permission to update this data."});
        // if they aren't redirect them to the home page
       // res.redirect('/');

        const tree = await Tree.find({numphone: req.body.numphone}, 'authId')
                                    .populate({
                                        path: "authId",
                                        select: "treename author address numMem profileImage",
                                        model: Author,
                                    });

        if (!tree) return res.status(401).json({message: 'There are no info to display'});


        res.status(200).json({tree});
    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
};