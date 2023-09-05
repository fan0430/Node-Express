const todos = [
    'first todo', 'second todo', 'third todo'
]

// 建立一個 todoModel 物件，裡面放存取資料的方法（function）
const todoModel = {
    getAll: () => {
        return todos
    },

    get: id => {
        return todos[id]
    }
}

module.exports = todoModel