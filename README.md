# Three Trees CRM TODO

# Client Table 
[ ] finish data table setup 
-> [x] add sort                     # Implemented with getSortedRowModel
-> [ ] add filter + input filter
-> [x] add pagination               # Implemented with DataTablePagination
-> [ ] column toggle
-> [x] rows per page               # Implemented in DataTablePagination
-> [x] select rows + actions       # Added row selection (actions still pending)
-> [ ] row actions (delete, modify tag, duplicate, edit)
-> [ ] add new client

# Functionality
[ ] connect WIX form webhook
[ ] signup confirmation, send documents to fill out
[ ] clients table should show all class(es) that individuals are currently enrolled in (class type only)
[ ] best practice from a db stand point when dealing with recurring tasks - better set from code or db? my guess is code 
[ ] class assignments 
-> [ ] class type should be on the client table, multi-select. so if the user needs to take DV and Level1, both of those should be selected. 
-> [ ] specific assignment options conditionally display as drop down options maybe? so if classtype is selected [DV] should show a DV column maybe - and for that column the admin can select from current available options 

# Payments 
[ ] connect square webhook
[ ] single button text Valant signup link

# Attendance 
- can see classes that are upcoming or active now and use to take attendance
- look into google meet api for autologging users (best ultimately to bring in house but idk how much effort this is)

# reporting
[ ] set up basic reporting, monthly county by county

# Phase X
[ ] setup role levels for users 
[ ] restrict specific actions by user role

NEXT LEVEL
# Livekit or Daily? 
[ ] video conferencing 

# Client Dashboard 
- view progress
- access learning materials 
- join classes
- make payments 

# Facilitator Dashboard
- view active classes 
- join + manage live class
- take attendance (might be automated)

# Admin Dashboard
- view active clients, facilitiators, classes
- manage payments 
- manage reporting

