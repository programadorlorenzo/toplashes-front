# LoginResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**accessToken** | **string** | Token de acceso JWT | [default to undefined]
**refreshToken** | **string** | Token de refresh | [default to undefined]
**user** | [**AuthUserResponseDto**](AuthUserResponseDto.md) | Datos del usuario | [default to undefined]

## Example

```typescript
import { LoginResponseDto } from './api';

const instance: LoginResponseDto = {
    accessToken,
    refreshToken,
    user,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
