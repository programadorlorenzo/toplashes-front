# CreateServiceDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Nombre del servicio | [default to undefined]
**categoryId** | **number** | ID de la categoría | [default to undefined]
**description** | **string** | Descripción | [optional] [default to undefined]
**price** | **number** | Precio | [default to undefined]
**duration** | **number** | Duración en minutos | [default to undefined]
**prepTime** | **number** | Tiempo de preparación en minutos | [optional] [default to 0]
**isActive** | **boolean** | Si está activo | [optional] [default to true]
**allowConcurrent** | **boolean** | Permite servicios simultáneos (ej. durante secado/procesamiento) | [optional] [default to false]
**branchIds** | **Array&lt;number&gt;** | IDs de sucursales donde se ofrece | [optional] [default to undefined]

## Example

```typescript
import { CreateServiceDto } from './api';

const instance: CreateServiceDto = {
    name,
    categoryId,
    description,
    price,
    duration,
    prepTime,
    isActive,
    allowConcurrent,
    branchIds,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
