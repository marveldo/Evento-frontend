import z from 'zod'


export const Passwordschema =z.object({
    'new_password' : z.string({
        'message' : 'New password cannot be empty'
    }).min(8 , {
        'message': 'password cannot be less than 8 values'
    }).max(20, {
        'message': 'Maximum length of value value is 20 '
    }),
    'confirm_new_password' : z.string({
        'message' : 'New password Confirmation cannot be empty'
    }).min(8 , {
        'message': 'password cannot be less than 8 values'
    }).max(20, {
        'message': 'Maximum length of value value is 20 '
    })
}).refine((data) => data.new_password === data.confirm_new_password, {
    'message': 'Passwords dont match',
    'path': ['confirm_new_password']
})