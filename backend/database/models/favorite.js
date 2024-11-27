module.exports=(sequelize,DataTypes)=>{

    const Favourites=sequelize.define('Favourites', {
      
        added_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        }, 
  
      }, { timestamps: false })
    
    return Favourites
    }