const User = require("../../models/user");
const bcrypt= require('bcrypt');
const passport = require("passport");
function authController(){
    //factory pattern
    return{
        login(req,res){
            res.render('auth/login');
        },
        postLogin(req,res, next){
            passport.authenticate('local', (err, user, info) =>{
                if(err){
                    req.flash('error', info.message);
                    return next(err); 
                }
                if(!user)
                {
                    req.flash('error', info.message);
                    return res.redirect('/login');
                }
                req.logIn(user, (err) =>{
                    if(err){
                        req.flash('error', info.message);
                        return next(err); 
                    }
                    return res.redirect('/');
                }) 
            })(req, res, next); // when we call passport. wuthenticate it returns a function 
        },
        register(req,res)
        {
            res.render('auth/register');
        },
        async postRegister( req,res)
        {
            const {name, email, password} = req.body;
            //Validate request
            if(!name || !email ||  !password) 
            {
                req.flash('error', 'All Fields  are required');
                req.flash('name', name);
                req.flash('email', email);
                // req.flash('name', name);
                return res.redirect('/register');
            }
            // check for email
            User.exists({email:email}, (err, res) =>{
                if(res){
                    req.flash('error', 'Email Exist');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register');
                }
            })
            //Hash Password
            const hashedPassword=await bcrypt.hash(password, 10);
            // create a user
            const user= new User({
                name: name,
                email: email,
                password: hashedPassword
            })
            user.save()
            .then((user) =>{
                
                return res.redirect('/');
            })
            .catch((err)=> {
                req.flash('error', 'Something Went Wrong ');
                    return res.redirect('/register');
            })
            console.log(req.body);
        },
        logout(req,res)
        {
            req.logout();
            return res.redirect('/login');
        }
    }
}
module.exports= authController;