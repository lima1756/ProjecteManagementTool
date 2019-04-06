const util = require('util')
const DBController = require('./DBController');

const greaterThan = '>',
    greaterOrEqualThan = '>=',
    lessThan = '<',
    lessOrEqualThan = '<=',
    iqualThan = '=',
    differentThan = '!=',
    is = 'IS',
    isNot= 'IS NOT',
    nullValue = 'NULL',
    and = 'AND',
    or = 'OR',
    not = 'not',
    selectType = 'SELECT',
    updateType = 'UPDATE',
    insertType = 'INSERT',
    deleteType = 'DELETE';


//module.exports = 
class Query{

    static get Comparator(){
        return class Comparator{

            greaterThan(columnName, value){
                this.structure = this.comparator(columnName, value, greaterThan);
                return this;
            }

            greaterThanOrEqualTo(columnName, value){
                this.structure = this.comparator(columnName, value, greaterOrEqualThan);
                return this;
            }
        
            lessThan(columnName, value){
                this.structure = this.comparator(columnName, value, lessThan);
                return this;
            }
            
            lessThanOrEqualTo(columnName, value){
                this.structure = this.comparator(columnName, value, lessOrEqualThan);
                return this;
            }
        
            equalTo(columnName, value){
                this.structure = this.comparator(columnName, value, iqualThan);
                return this;
            }

            differentThan(columnName, value){
                this.structure = this.comparator(columnName, value, differentThan);
                return this;
            }

            isNull(columnName){
                this.structure = this.comparator(columnName, nullValue, is);
                return this;
            }

            isNotNull(columnName){
                this.structure = this.comparator(columnName, nullValue, isNot);
                return this;
            }
        
            comparator(columnName, value, symbol){
                return {
                    columnName: columnName,
                    value: value,
                    symbol: symbol
                }
            }

            static and(...args){
                let result;
                Query.argsToArray(args, (arr)=>{
                    result = Comparator.aggrupator(arr, and);
                });
                return result;               
            } 

            static or(...args){
                let result;
                Query.argsToArray(args, (arr)=>{
                    result = Comparator.aggrupator(arr, or);
                });
                return result;
            }

            static not(...args){
                let result;
                Query.argsToArray(args, (arr)=>{
                    result = Comparator.aggrupator(arr, not);
                });
                return result;
            }

            static aggrupator(comparators, aggrupation){
                return {
                    aggrupation:aggrupation,
                    comparators: comparators
                }
            }
        
        }
    }
    
    constructor(table){
        this.structure = {
            tableName:table
        };
        return this;
    }

    select(...args){
        this.checkQueryTypeError(selectType);
        Query.argsToArray(args, (arr)=>{
            this.structure.select = {
                columns: arr
            }
        });
        return this;
    }

    join(table, onConditional){
        if(!this.structure.join)
            this.structure.join = []   
        this.structure.join.push({
            tableName: table,
            on: onConditional
        });
        return this;
    }

    leftJoin(table, onConditional){
        if(!this.structure.join)
            this.structure.leftJoin = []   
        this.structure.leftJoin.push({
            tableName: table,
            on: onConditional
        });
        return this;
    }

    rightJoin(table, onConditional){
        if(!this.structure.join)
            this.structure.rightJoin = []   
        this.structure.rightJoin.push({
            tableName: table,
            on: onConditional
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

    orderBy(...args){
        Query.argsToArray(args, (arr)=>{
            this.structure.orderBy = arr;
        });
        return this;
    }

    /**
     * 
     * @param  {...any} args The arguments of the function should be or an array of key-value pairs (key is the column and the pair the new value)
     * or different arguments of key-value pairs.
     */
    update(...args){
        this.checkQueryTypeError(updateType);
        Query.argsToArray(args, (arr)=>{
            this.structure.updateSet = arr;
        })
        return this;
    }

    insert(){
        this.checkQueryTypeError(insertType);
        // TODO: Finish this
        return this;
    }

    delete(){
        this.checkQueryTypeError(deleteType);
        return this;
    }


    run(){
        // TODO: Create state machine to create query based on structure
        console.log(util.inspect(this, false, null, true));
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

    static argsToArray(args, callback){
        if(args.length==1){
            callback(args[0])
        }
        else if(args.length>1){
            callback(args)
        }
        else{
            throw Query.argsError;
        }
    }
}

const andCom = Query.Comparator.and([new Query.Comparator().greaterThanOrEqualTo('a', 1), new Query.Comparator().equalTo('b', 20)]);
const orCom = Query.Comparator.or([andCom, new Query.Comparator().isNotNull('c')]);

const havingCom = new Query.Comparator().equalTo('count(d)',20);

(new Query('table')).select('a','b','c','count(d)')
    .join('table2', (new Query.Comparator).equalTo('table.b','table2.f'))
    .where(orCom)
    .groupBy()
    .having(havingCom)
    .run();
