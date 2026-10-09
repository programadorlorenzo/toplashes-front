# ColaboradorasApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**employeeControllerAssignBranches**](#employeecontrollerassignbranches) | **PUT** /employees/{id}/branches | Asignar sucursales a colaboradora|
|[**employeeControllerAssignServices**](#employeecontrollerassignservices) | **PUT** /employees/{id}/services | Asignar servicios a colaboradora|
|[**employeeControllerCreate**](#employeecontrollercreate) | **POST** /employees | Crear colaboradora|
|[**employeeControllerFindAll**](#employeecontrollerfindall) | **GET** /employees | Listar colaboradoras|
|[**employeeControllerFindOne**](#employeecontrollerfindone) | **GET** /employees/{id} | Obtener colaboradora por ID|
|[**employeeControllerRemove**](#employeecontrollerremove) | **DELETE** /employees/{id} | Eliminar colaboradora|
|[**employeeControllerUpdate**](#employeecontrollerupdate) | **PUT** /employees/{id} | Actualizar colaboradora|

# **employeeControllerAssignBranches**
> EmployeeResponseDto employeeControllerAssignBranches(assignEmployeeBranchesDto)


### Example

```typescript
import {
    ColaboradorasApi,
    Configuration,
    AssignEmployeeBranchesDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ColaboradorasApi(configuration);

let id: number; // (default to undefined)
let assignEmployeeBranchesDto: AssignEmployeeBranchesDto; //

const { status, data } = await apiInstance.employeeControllerAssignBranches(
    id,
    assignEmployeeBranchesDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignEmployeeBranchesDto** | **AssignEmployeeBranchesDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**EmployeeResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **employeeControllerAssignServices**
> EmployeeResponseDto employeeControllerAssignServices(assignEmployeeServicesDto)


### Example

```typescript
import {
    ColaboradorasApi,
    Configuration,
    AssignEmployeeServicesDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ColaboradorasApi(configuration);

let id: number; // (default to undefined)
let assignEmployeeServicesDto: AssignEmployeeServicesDto; //

const { status, data } = await apiInstance.employeeControllerAssignServices(
    id,
    assignEmployeeServicesDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignEmployeeServicesDto** | **AssignEmployeeServicesDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**EmployeeResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **employeeControllerCreate**
> EmployeeResponseDto employeeControllerCreate(createEmployeeDto)


### Example

```typescript
import {
    ColaboradorasApi,
    Configuration,
    CreateEmployeeDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ColaboradorasApi(configuration);

let createEmployeeDto: CreateEmployeeDto; //

const { status, data } = await apiInstance.employeeControllerCreate(
    createEmployeeDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createEmployeeDto** | **CreateEmployeeDto**|  | |


### Return type

**EmployeeResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **employeeControllerFindAll**
> Array<EmployeeResponseDto> employeeControllerFindAll()


### Example

```typescript
import {
    ColaboradorasApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ColaboradorasApi(configuration);

const { status, data } = await apiInstance.employeeControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<EmployeeResponseDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **employeeControllerFindOne**
> EmployeeResponseDto employeeControllerFindOne()


### Example

```typescript
import {
    ColaboradorasApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ColaboradorasApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.employeeControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**EmployeeResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **employeeControllerRemove**
> employeeControllerRemove()


### Example

```typescript
import {
    ColaboradorasApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ColaboradorasApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.employeeControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Colaboradora eliminada |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **employeeControllerUpdate**
> EmployeeResponseDto employeeControllerUpdate(updateEmployeeDto)


### Example

```typescript
import {
    ColaboradorasApi,
    Configuration,
    UpdateEmployeeDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ColaboradorasApi(configuration);

let id: number; // (default to undefined)
let updateEmployeeDto: UpdateEmployeeDto; //

const { status, data } = await apiInstance.employeeControllerUpdate(
    id,
    updateEmployeeDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateEmployeeDto** | **UpdateEmployeeDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**EmployeeResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

