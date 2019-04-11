const Query = require('./Query');
const ErrorManager = require('./ErrorManager')

module.exports = class ProjectPermissionsController{

    static get PermissionsType(){
        return {
            TASK_CREATE: 'task_create',
            TASK_EDIT: 'task_edit',
            MILESTONE_CREATE: 'milestone_create',
            MILESTONE_EDIT: 'milestone_edit',
            MILESTONE_TASK_DELETE: 'milestone_task_delete',
            TAGS_CREATE: 'tags_create',
            TAGS_EDIT: 'tags_edit',
            TAGS_DELETE: 'tags_delete',
            LIST_CREATE: 'list_create',
            LIST_DELETE: 'list_delete',
            TASK_IN_LIST_MOVE: 'tasks_in_lists_move'
        };
    }

    static checkPermission(userId, projectId, permissionType){
        return new Promise((resolve, reject)=>{
            new Query('project_permissions')
                .select('person_id')
                .where(Query.Comparator.and(
                    new Query.Comparator().equalTo(permissionType, 1),
                    new Query.Comparator().equalTo('project_id', projectId),
                    new Query.Comparator().equalTo('person_id', userId)
                ))
                .run()
            .then(result=>{
                if(result.rows.length == 1){
                    resolve(true);
                }
                else{
                    reject(new ErrorManager.Forbidden("You're not authorized to do this"))
                }  
            })
            .catch(err => {
                reject(err)
            });
        });
    }

    static checkIfContributorToProject(userId, projectId){
        return new Promise((resolve, reject)=>{
            new Query('project_permissions')
                .select('person_id')
                .where(Query.Comparator.and(
                    new Query.Comparator().equalTo('project_id', projectId),
                    new Query.Comparator().equalTo('person_id', userId)
                ))
                .run()
            .then(result=>{
                if(result.rows.length == 1){
                    resolve(true);
                }
                else{
                    reject(new ErrorManager.Forbidden("You're not authorized to do this"))
                }  
            })
            .catch(err => {
                reject(err)
            });
        });
    }
}
