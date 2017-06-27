# Vehicle Inspection Example

## Setup

Run `lerna bootstrap --scope=@raincatcher/example-vehicle-inspection --include-scoped-dependencies`

## Sequential use cases

1. Create a new Process
2. Add a `VehicleInspectionTask` to the new Process
    * Configure it via a Form generated from the JsonSchema of the custom `Task`
3. Add a `UserSignOffTask` to the new Process
4. Create a ProcessInstance via a Executor and assign it to a User
5. As the assigned-to User, on the mobile app, start the execution of the `ProcessInstance`
7. Finish the execution of the `VehicleInspectionTask`, moving it to the `TaskStatus.DONE` state
8. Visualize the results of the `VehicleInspectionTask`
9. Execute the `UserSignOffTask`
