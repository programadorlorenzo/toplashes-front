# UsuariosApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**userControllerCreate**](#usercontrollercreate) | **POST** /users | Crear usuario|
|[**userControllerFindAll**](#usercontrollerfindall) | **GET** /users | Listar usuarios|
|[**userControllerFindOne**](#usercontrollerfindone) | **GET** /users/{id} | Obtener usuario por ID|
|[**userControllerRemove**](#usercontrollerremove) | **DELETE** /users/{id} | Eliminar usuario|
|[**userControllerUpdate**](#usercontrollerupdate) | **PUT** /users/{id} | Actualizar usuario|

# **userControllerCreate**
> UserResponseDto userControllerCreate(createUserDto)


### Example

```typescript
import {
    UsuariosApi,
    Configuration,
    CreateUserDto
} from './api';

const configuration = new Configuration();
const apiInstance = new UsuariosApi(configuration);

let createUserDto: CreateUserDto; //

const { status, data } = await apiInstance.userControllerCreate(
    createUserDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createUserDto** | **CreateUserDto**|  | |


### Return type

**UserResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |
|**400** | Error de validación |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerFindAll**
> Array<UserResponseDto> userControllerFindAll()


### Example

```typescript
import {
    UsuariosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsuariosApi(configuration);

const { status, data } = await apiInstance.userControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<UserResponseDto>**

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

# **userControllerFindOne**
> UserResponseDto userControllerFindOne()


### Example

```typescript
import {
    UsuariosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsuariosApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.userControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**UserResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**404** | Usuario no encontrado |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerRemove**
> userControllerRemove()


### Example

```typescript
import {
    UsuariosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsuariosApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.userControllerRemove(
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
|**200** | Usuario eliminado |  -  |
|**404** | Usuario no encontrado |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerUpdate**
> UserResponseDto userControllerUpdate(updateUserDto)


### Example

```typescript
import {
    UsuariosApi,
    Configuration,
    UpdateUserDto
} from './api';

const configuration = new Configuration();
const apiInstance = new UsuariosApi(configuration);

let id: number; // (default to undefined)
let updateUserDto: UpdateUserDto; //

const { status, data } = await apiInstance.userControllerUpdate(
    id,
    updateUserDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserDto** | **UpdateUserDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**UserResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**404** | Usuario no encontrado |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

