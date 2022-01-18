export enum ActionsTypes {
    /* Orders */

    UPDATE_ORDER = 'UPDATE_ORDER',
    UPDATE_ORDER_IN_EDIT = 'UPDATE_ORDER_IN_EDIT',
    DELETE_ORDER = 'DELETE_ORDER',
    CLONE_ORDER = 'CLONE_ORDER',
    EDIT_ORDER = 'EDIT_ORDER',
    CLICKED_ORDER = 'CLICKED_ORDER',
    ADD_NEW_ORDER = 'ADD_NEW_ORDER',

    /* Import - Export */
    OPEN_MY_PROFILE = 'OPEN_MY_PROFILE',
    EXPORT_ALL = 'EXPORT_ALL',
    IMPORT_ALL = 'IMPORT_ALL',
    IMPORT_FILE_UPLOADED = 'IMPORT_FILE_UPLOADED',
    IMPORT_ORDERS_AS_TEXT = 'IMPORT_ORDERS_AS_TEXT',
    IMPORT_DIALOG_OPEN = 'IMPORT_DIALOG_OPEN',

    /* Sidur */
    DELETE_SIDUR = 'DELETE_SIDUR',
    DELETE_FOREVER_SIDUR = 'DELETE_FOREVER_SIDUR',
    RENAME_SIDUR = 'RENAME_SIDUR',
    ADD_NEW_SIDUR = 'ADD_NEW_SIDUR',
    CLONE_SIDUR = 'CLONE_SIDUR',
    CHOOSE_SIDUR = 'CHOOSE_SIDUR',
    ARCHIVE_SIDUR = 'ARCHIVE_SIDUR',
    MOVE_TO_ACTIVE_SIDUR = 'MOVE_TO_ACTIVE_SIDUR',


    /* Vehicle */
    UPDATE_VEHICLE = 'UPDATE_VEHICLE',
    NEW_VEHICLE = 'NEW_VEHICLE',
    DELETE_VEHICLE = 'DELETE_VEHICLE',

    /* display */
    STOP_LOADING_ANIMATION = 'STOP_LOADING_ANIMATION',
    START_LOADING_ANIMATION = 'START_LOADING_ANIMATION',
    CHANGE_VIEW = 'CHANGE_VIEW',

    /* Sketch */
    NEW_SKETCH = 'NEW_SKETCH',
    DELETE_SKETCH = 'DELETE_SKETCH',
    RENAME_SKETCH = 'RENAME_SKETCH',
    CLONE_SKETCH = 'CLONE_SKETCH',
    CHOOSE_SKETCH = 'CHOOSE_SKETCH',

    /* Sketch Drive */
    UPDATE_SKETCH_DRIVE = 'UPDATE_SKETCH_DRIVE',
    DELETE_SKETCH_DRIVE = 'DELETE_SKETCH_DRIVE',
    REMOVE_ORDER_FROM_SKETCH_DRIVE = 'REMOVE_ORDER_FROM_SKETCH_DRIVE',

    /*pending Orders */
    CLICKED_PENDING_ORDER = 'CLICKED_PENDING_ORDER',
    CLICKED_CLOSE_PENDING_ORDER = 'CLICKED_CLOSE_PENDING_ORDER',

    CLICKED_REMOVE_PENDING_ORDER = 'CLICKED_REMOVE_PENDING_ORDER',
    CLICKED_MERGE_PENDING_ORDER = 'CLICKED_MERGE_PENDING_ORDER',
    CLICKED_SPLIT_PENDING_ORDER = 'CLICKED_SPLIT_PENDING_ORDER',
    CLICKED_CHANGE_PENDING_ORDER = 'CLICKED_CHANGE_PENDING_ORDER',
    CLICKED_CHANGE_TIME_PENDING_ORDER = 'CLICKED_CLOSE_PENDING_ORDER',
    CLICKED_REPLACE_EXISTING_PENDING_ORDER = 'CLICKED_REPLACE_EXISTING_PENDING_ORDER',
    CLICKED_PUBLIC_TRANSPORT_PENDING_ORDER = 'CLICKED_PUBLIC_TRANSPORT_PENDING_ORDER',
    CLICKED_ADD_TO_PENDING_PENDING_ORDER = 'CLICKED_ADD_TO_PENDING_PENDING_ORDER',


    /* Location groups */
    UPDATE_LOCATION_GROUP = 'UPDATE_LOCATION_GROUP',
    DELETE_LOCATION_GROUP = 'DELETE_LOCATION_GROUP',
    NEW_LOCATION_GROUP = 'NEW_LOCATION_GROUP',
    CLONE_LOCATION_GROUP = 'CLONE_LOCATION_GROUP',
    RENAME_LOCATION_GROUP = 'RENAME_LOCATION_GROUP',
    CHOOSE_LOCATION_GROUP = 'CHOOSE_LOCATION_GROUP',
    CHOOSE_LOCATION_GROUP_TAB = 'CHOOSE_LOCATION_GROUP_TAB',

    /* Locations */
    START_EDIT_LOCATION = 'START_EDIT_LOCATION',
    STOP_EDIT_LOCATION = 'STOP_EDIT_LOCATION',
    ADD_NEW_LOCATION = 'ADD_NEW_LOCATION',
    UPDATE_LOCATION = 'UPDATE_LOCATION',
    DELETE_LOCATION = 'DELETE_LOCATION',

    /* Routes */
    START_EDIT_ROUTE = 'START_EDIT_ROUTE',
    STOP_EDIT_ROUTE = 'STOP_EDIT_ROUTE',
    ADD_NEW_ROUTE = 'ADD_NEW_ROUTE',
    ADD_LOCATION_TO_ROUTE = 'ADD_LOCATION_TO_ROUTE',
    UPDATE_ROUTE = 'UPDATE_ROUTE',
    DELETE_ROUTE = 'DELETE_ROUTE',
}


