﻿using System.Net.Http.Headers;
using System.Net.Http.Json;
using Api.Dtos.Users;
using Domain.Users;
using Tests.Common;
using Tests.Data;
using Xunit;

namespace Api.Tests.Integration.Users;

public class DeleteTests : BaseIntegrationTest, IAsyncLifetime
{
    private readonly User _mainUser;
    private readonly User _secondUser;
    private readonly User _adminUser;

    public DeleteTests(IntegrationTestWebFactory factory) : base(factory)
    {
        _mainUser = UsersData.MainUser();
        _secondUser = UsersData.AnotherUser();
        _adminUser = UsersData.AdminUser();
    }

    [Fact]
    public async Task DeleteUser_Success_WhenAdminIsAuthorized()
    {
        var authToken = await GenerateAuthTokenAsync(_adminUser.Login, _adminUser.Password);
        var userId = _mainUser.Id;

        Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);

        var response = await Client.DeleteAsync($"users/delete/{userId}");

        response.EnsureSuccessStatusCode();
        var deletedUser = await Context.Users.FindAsync(userId);
        Assert.Null(deletedUser);
    }

    [Fact]
    public async Task DeleteUser_Fails_WhenUserIsNotAdmin()
    {
        var authToken = await GenerateAuthTokenAsync(_mainUser.Login, _mainUser.Password);
        var userId = _secondUser.Id;

        Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);

        var response = await Client.DeleteAsync($"users/delete/{userId}");

        Assert.Equal(System.Net.HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task DeleteUser_Fails_WhenUserNotFound()
    {
        var authToken = await GenerateAuthTokenAsync(_adminUser.Login, _adminUser.Password);
        var nonExistentUserId = Guid.NewGuid();

        Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);

        var response = await Client.DeleteAsync($"users/delete/{nonExistentUserId}");

        Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DeleteUser_Fails_WhenNoAuthTokenProvided()
    {
        var userId = _mainUser.Id;

        var response = await Client.DeleteAsync($"users/delete/{userId}");

        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task DeleteUser_Fails_WhenInvalidAuthTokenProvided()
    {
        var invalidAuthToken = "invalid_token";
        var userId = _mainUser.Id;

        Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", invalidAuthToken);

        var response = await Client.DeleteAsync($"users/delete/{userId}");

        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    public async Task InitializeAsync()
    {
        await Context.Users.AddRangeAsync(_mainUser, _adminUser, _secondUser);
        await SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        Context.Users.RemoveRange(Context.Users);
        await SaveChangesAsync();
    }
}
