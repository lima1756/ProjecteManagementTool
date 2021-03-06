const DBController = require('./DBController');

const GREATER_THAN = '>',
    GREATER_THAN_OR_EQUAL_TO = '>=',
    LESS_THAN = '<',
    LESS_THAN_OR_EQUAL_TO = '<=',
    EQUAL_TO = '=',
    DIFFERENT_TO = '!=',
    IS_OPERATOR = 'IS',
    LIKE_OPERATOR = 'LIKE',
    IS_NOT_OPERATOR= 'IS NOT',
    NULL_VALUE = 'NULL',
    AND_OPERATOR = 'AND',
    OR_OPERATOR = 'OR',
    NOT_OPERATOR = 'not',
    SELECT_TYPE = 'SELECT',
    UPDATE_TYPE = 'UPDATE',
    INSERT_TYPE = 'INSERT',
    DELETE_TYPE = 'DELETE',
    RAW_TYPE = 'RAW';


// TODO: create documentation

module.exports = class Query{

    static get Comparator(){
        return class Comparator{

            greaterThan(columnName, value){
                this.structure = this.comparator(columnName, value, GREATER_THAN);
                return this;
            }

            greaterThanOrEqualTo(columnName, value){
                this.structure = this.comparator(columnName, value, GREATER_THAN_OR_EQUAL_TO);
                return this;
            }
        
            lessThan(columnName, value){
                this.structure = this.comparator(columnName, value, LESS_THAN);
                return this;
            }
            
            lessThanOrEqualTo(columnName, value){
                this.structure = this.comparator(columnName, value, LESS_THAN_OR_EQUAL_TO);
                return this;
            }
        
            equalTo(columnName, value){
                this.structure = this.comparator(columnName, value, EQUAL_TO);
                return this;
            }

            like(columnName, value){
                this.structure = this.comparator(columnName, value, LIKE_OPERATOR);
                return this;
            }

            differentThan(columnName, value){
                this.structure = this.comparator(columnName, value, DIFFERENT_TO);
                return this;
            }

            isNull(columnName){
                this.structure = this.comparator(columnName, NULL_VALUE, IS_OPERATOR);
                return this;
            }

            isNotNull(columnName){
                this.structure = this.comparator(columnName, NULL_VALUE, IS_NOT_OPERATOR);
                return this;
            }
        
            comparator(column, value, symbol){
                value = Query.checkForBooleans(value);
                return {
                    column: column,
                    value: value,
                    symbol: symbol
                }
            }

            static and(...args){
                let result;
                Query.argsToArray(args, (arr)=>{
                    result = Comparator.operator(arr, AND_OPERATOR);
                });
                return result;               
            } 

            static or(...args){
                let result;
                Query.argsToArray(args, (arr)=>{
                    result = Comparator.operator(arr, OR_OPERATOR);
                });
                return result;
            }

            static not(...args){
                let result;
                Query.argsToArray(args, (arr)=>{
                    result = Comparator.operator(arr, NOT_OPERATOR);
                });
                return result;
            }

            static operator(comparators, operator){
                return {
                    isAggrupation: true,
                    operator:operator,
                    comparators: comparators
                }
            }

            static createConditional(operation){
                let conditionalString = ''
                if(operation.hasOwnProperty('isAggrupation')){
                    if(operation.operator==NOT_OPERATOR){
                        conditionalString += NOT_OPERATOR + ' ';
                    }
                    conditionalString += '( '
                    for(let i = 0; i < operation.comparators.length; i++){
                        let comparator = operation.comparators[i];
                        
                        conditionalString += Comparator.createConditional(comparator);
                        if(operation.operator!=NOT_OPERATOR && i!=operation.comparators.length-1){
                            conditionalString += operation.operator + ' ';
                        }
                        else if(i==operation.comparators.length-1)
                        {
                            conditionalString += ' ';
                        }
                    }
                    conditionalString += ') '
                }
                else{
                    if(typeof(operation.structure.column)!=typeof('')){
                        throw new Error('This field should be a string representing a column of your table');
                    }
                    else{
                        conditionalString += operation.structure.column + ' ';
                    }
                    conditionalString += operation.structure.symbol + ' ';
                    if(typeof(operation.structure.value)==typeof({})){
                        conditionalString += '( ' + Query.createSelect(operation.structure.value) + ') ';
                    }
                    else{
                        conditionalString += operation.structure.value + ' ';
                    }
                }

                return conditionalString;
            }
        
        }
    }
    
    constructor(table){
        this.structure = {
            table:table
        };
        return this;
    }

    select(...args){
        this.checkQueryTypeError(SELECT_TYPE);
        Query.argsToArray(args, (arr)=>{
            this.structure.select = {
                columns: arr
            }
        });
        return this;
    }

    join(table, onConditional){
        this.structure.join = this.structure.join || []   
        this.structure.join.push({
            table: table,
            onConditional: onConditional
        });
        return this;
    }

    leftJoin(table, onConditional){
        this.structure.leftJoin = this.structure.leftJoin || []   
        this.structure.leftJoin.push({
            table: table,
            onConditional: onConditional
        });
        return this;
    }

    rightJoin(table, onConditional){
        this.structure.rightJoin = this.structure.rightJoin || []   
        this.structure.rightJoin.push({
            table: table,
            onConditional: onConditional
        });
        return this;
    }

    where(comparator){
        this.structure.where = comparator;
        return this;
    }

    groupBy(...args){
        Query.argsToArray(args, (arr)=>{
            this.structure.groupBy = arr;
        });
        return this;
    }

    having(comparator){
        this.structure.having = comparator;
        return this;
    }

    orderBy(desc, ...args){
        this.structure.orderBy = {};
        Query.argsToArray(args, (arr)=>{
            this.structure.orderBy.columns = arr;
        });
        this.structure.orderBy.orderDesc = desc;
        return this;
    }

    /**
     * 
     * @param  {...any} args The arguments of the function should be an array of arrays 
     * or different arguments of arrays. This second arrays should be [column, <new_value>]
     */
    update(...args){
        this.checkQueryTypeError(UPDATE_TYPE);
        Query.argsToArray(args, (arr)=>{
            this.structure.updateSet = arr;
        })
        return this;
    }

    insert(returnId=true, ...args){
        this.checkQueryTypeError(INSERT_TYPE);
        Query.argsToArray(args, (arr)=>{
            this.structure.insertColumns = arr;
        }, false);
        this.structure.returnId = returnId;
        return this;
    }

    insertValues(...args){
        this.structure.insertValues = this.structure.insertValues || [];
        Query.argsToArray(args, (arr)=>{
            if(Array.isArray(arr[0])){
                for(let i = 0; i < arr.length; i++){
                    this.structure.insertValues.push(arr[i]);
                }
            }
            else{
                this.structure.insertValues.push(arr);
            }
        })
        return this;
    }

    delete(){
        this.checkQueryTypeError(DELETE_TYPE);
        return this;
    }


    async run(printQuery=false, binds = {}, options = {}){
        switch(this.structure.type){
            case SELECT_TYPE:
                this.queryString = Query.createSelect(this);
                break;
            case UPDATE_TYPE:
                this.queryString = Query.createUpdate(this);
                break;
            case DELETE_TYPE:
                this.queryString = Query.createDelete(this);
                break;
            case INSERT_TYPE:
                this.queryString = Query.createInsert(this);
                break;
            case RAW_TYPE:
                console.warn("Please be carefull when running raw queries");
                break;
            default:
                throw new Error('There is no CRUD operation selected, please add an operation in your method calls');
            
        }
        
        if(printQuery)
            console.log(this.queryString);
        if(!DBController.instance){
            await new DBController(null);
        }
        return DBController.instance.executeSQL(this.queryString, binds, options);
        // console.log(util.inspect(this, false, null, true));
    }

    raw(sql){
        this.queryString = sql;
        this.structure = {
            type: RAW_TYPE
        }
        return this;
    }

    checkQueryTypeError(newType){
        if(!this.structure.type)
            this.structure.type = newType;
        else
            throw new Error(`This query was already type of: ${this.structure.type} and is not compatible with ${newType}`);
    }

    static get argsError(){ 
        return new Error(`This method needs an array of elements or multiple elements as arguments`);
    }   

    static argsToArray(args, callback, throwErrorIfZero=true){
        if(args.length==1 && Array.isArray(args[0])){
            callback(args[0])
        }
        else if(args.length>1 || (args.length==1 && !Array.isArray(args[0]))){
            callback(args)
        }
        else if(args.length==0 && throwErrorIfZero){
            throw Query.argsError;
        }
        else if(args.length==0 && !throwErrorIfZero){
            callback([])
        }
        else{
            throw Query.argsError;
        }
    }

    static createSelect(queryObject){
        let queryString = 'SELECT '
        for(let i = 0; i < queryObject.structure.select.columns.length; i++){
            queryString += queryObject.structure.select.columns[i]
            if(i != queryObject.structure.select.columns.length-1)
                queryString += ', '
            else
                queryString += ' '
        }
        queryString += 'FROM ';
        if(typeof(queryObject.structure.table)==typeof({})){
            queryString += '( ';
            queryString = Query.createSelect(queryObject.structure.table);
            queryString += ') ';
        }
        else{
            queryString += queryObject.structure.table + ' '
        }
        if(queryObject.structure.hasOwnProperty('join')){
            for(let i = 0; i < queryObject.structure.join.length; i++){
                const join = queryObject.structure.join[i];
                queryString += 'JOIN '+ Query.createJoin(join)
            }
        }
        if(queryObject.structure.hasOwnProperty('leftJoin')){
            for(let i = 0; i < queryObject.structure.leftJoin.length; i++){
                const join = queryObject.structure.leftJoin[i];
                queryString += 'LEFT JOIN '+ Query.createJoin(join)
            }
        }
        if(queryObject.structure.hasOwnProperty('rightJoin')){
            for(let i = 0; i < queryObject.structure.rightJoin.length; i++){
                const join = queryObject.structure.leftJoin[i];
                queryString += 'RIGHT JOIN '+ Query.createJoin(join)
            }
        }

        queryString += Query.createWhere(queryObject);

        if(queryObject.structure.hasOwnProperty('groupBy')){
            queryString += 'GROUP BY ';
            for(let i = 0; i < queryObject.structure.groupBy.length; i++){
                const groupByColumn = queryObject.structure.groupBy[i];
                queryString += groupByColumn;
                if(i!=queryObject.structure.groupBy.length-1){
                    queryString += ', '
                }
                else{
                    queryString += ' '
                }
            }
        }

        if(queryObject.structure.hasOwnProperty('having')){
            queryString += 'HAVING '+ Query.Comparator.createConditional(queryObject.structure.having);
        }

        if(queryObject.structure.hasOwnProperty('orderBy')){
            queryString += 'ORDER BY ';
            for(let i = 0; i < queryObject.structure.orderBy.columns.length; i++){
                queryString += queryObject.structure.orderBy.columns[i];
                if(i!=queryObject.structure.orderBy.columns.length-1)
                    queryString += ', ';
                else{
                    queryString += ' ';
                }
            }
            if(queryObject.structure.orderBy.orderDesc){
                queryString += 'DESC ';
            }
            else if(!queryObject.structure.orderBy.orderDesc){
                queryString += 'ASC ';
            }
        }

        return queryString;
    }

    static createJoin(joinObject){
        let joinString = '';
        if(typeof(joinObject.table)==typeof({})){
            joinString += '( ';
            joinString += Query.createSelect(joinObject.table);
            joinString += ') ';
        }
        else{
            joinString += (joinObject.table + ' ');
        }
        joinString += 'ON ' + Query.Comparator.createConditional(joinObject.onConditional);
        
        return joinString;
    }

    static createWhere(queryObject){
        if(queryObject.structure.hasOwnProperty('where')){
            return 'WHERE '+ Query.Comparator.createConditional(queryObject.structure.where);
        }
        else{
            return '';
        }
    }

    static createUpdate(queryObject){
        let queryString = 'UPDATE ' + queryObject.structure.table + ' SET ';
        
        if(queryObject.structure.updateSet.length>=2 && typeof(queryObject.structure.updateSet[0])===typeof([])){
            for(let i = 0; i < queryObject.structure.updateSet.length; i++){
                let val;
                if(typeof(queryObject.structure.updateSet[i][1])==typeof("")){
                    val = "'"+queryObject.structure.updateSet[i][1]+"'";
                } else if(queryObject.structure.updateSet[i][1].isDate){
                    val = `TO_DATE( '${queryObject.structure.updateSet[i][1].date}', '${queryObject.structure.updateSet[i][1].format}')`;
                }  else {
                    val = Query.checkForBooleans(queryObject.structure.updateSet[i][1]);
                }
                
                queryString += queryObject.structure.updateSet[i][0]+' = '+val;
                if(i!=queryObject.structure.updateSet.length-1){
                    queryString+= ', '
                }
                else{
                    queryString+= ' '
                }
            }
        }
        else if(queryObject.structure.updateSet.length==2 && typeof(queryObject.structure.updateSet[0])!=typeof([])){
            let val;
            if(typeof(queryObject.structure.updateSet[1])==typeof("")){
                val = "'"+queryObject.structure.updateSet[1]+"'";
            } else {
                val = Query.checkForBooleans(queryObject.structure.updateSet[1]);
            }

            queryString += queryObject.structure.updateSet[0]+' = '+val + ' ';
        }
        queryString += Query.createWhere(queryObject);
        return queryString;
    }

    // TODO: right now you can only insert one at a time so I decided to 
    // only return the first query generated for that. Because of this, 
    // I need to fix this so the user could insert multiple rows at once
    static createInsert(queryObject){
        let prototype = 'INSERT INTO ' + queryObject.structure.table;
        if(queryObject.structure.insertColumns.length>0){
            prototype += '( '
            for(let i = 0; i < queryObject.structure.insertColumns.length; i++){
                prototype += queryObject.structure.insertColumns[i]
                if(i!=queryObject.structure.insertColumns.length-1){
                    prototype+= ', '
                }
                else{
                    prototype+= ' '
                }
            }
            prototype += ') '
        }
        else{
            prototype += ' '
        }
        prototype += 'VALUES'
        let queryString = [];
        for(let i = 0; i < queryObject.structure.insertValues.length; i++){
            let values = '( ';
            for(let j = 0; j < queryObject.structure.insertValues[i].length; j++){
                if(typeof(queryObject.structure.insertValues[i][j])==typeof("")){
                    values += "'"+queryObject.structure.insertValues[i][j]+"'";
                } else if(queryObject.structure.insertValues[i][j].isDate){
                    values += `TO_DATE( '${queryObject.structure.insertValues[i][j].date}', '${queryObject.structure.insertValues[i][j].format}')`;
                }   
                else{
                    values += Query.checkForBooleans(queryObject.structure.insertValues[i][j]);
                }
                if(j!=queryObject.structure.insertValues[i].length-1){
                    values+= ', '
                }
                else{
                    values+= ' '
                }
            }
            values += ') ';
            queryString.push(prototype+values+(queryObject.structure.returnId?"RETURN id INTO :id":""));
        }
        return queryString[0];
    }

    static createDelete(queryObject){
        let queryString = 'DELETE FROM ' + queryObject.structure.table + ' ';
        queryString += Query.createWhere(queryObject);
        return queryString;
    }

    static dateValue(date, format){
        return {
            isDate: true,
            date: date,
            format: format
        }
    }
    static checkForBooleans(value){
        if(typeof(value)==typeof(true)){
            return value?1:0;
        }
        else return value;
    }

}