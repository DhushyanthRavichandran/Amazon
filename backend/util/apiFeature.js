class ApiFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    search(){
        let keyword=this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:'i'
            }
        }:{};
        console.log(keyword);
        this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryStrCpy={...this.queryStr};
        const removeFields=['keyword','limit','page'];
        removeFields.forEach(field=>delete queryStrCpy[field]);
       
        let querystr=JSON.stringify(queryStrCpy);
        console.log('querystrcpy ' + querystr );
        querystr=querystr.replace(/\b(gt|gte|lt|lte)/g,match=>`$${match}`);
        this.query.find(JSON.parse(querystr));
        return this;
    }
    paginate(postPerPage){
        const currPage=Number(this.queryStr.page) || 1;
        const skip=postPerPage*( currPage-1);
        this.query.limit(postPerPage).skip(skip);
        return this;
    }
}

module.exports=ApiFeatures;