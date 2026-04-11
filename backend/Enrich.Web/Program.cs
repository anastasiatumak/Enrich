using Enrich.BLL;
using Enrich.DAL;
using Enrich.DAL.Data;
using Enrich.DAL.Entities;
using Enrich.WebAPI.Handlers;
using Enrich.WebAPI.Seeders;
using Enrich.WebAPI.Settings;
using Microsoft.AspNetCore.Identity;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

try
{
    Log.Information("Запуск веб-хоста (Web API)...");

    WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

    if (builder.Environment.IsStaging() || builder.Environment.IsProduction())
    {
        builder.Configuration.AddUserSecrets<Program>();
    }

    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext());

    builder.Services.Configure<IdentitySettings>(
        builder.Configuration.GetSection(IdentitySettings.Section));
    builder.Services.Configure<LocalizationSettings>(
        builder.Configuration.GetSection(LocalizationSettings.Section));

    var identitySettings = builder.Configuration
        .GetSection(IdentitySettings.Section)
        .Get<IdentitySettings>() ?? new IdentitySettings();

    // Register Services
    builder.Services.AddDalServices(builder.Configuration);
    builder.Services.AddBllServices(builder.Configuration);

    // Updated AddIdentity for IdentityRole<int>
    builder.Services.AddIdentity<User, IdentityRole<int>>(options =>
    {
        options.Password.RequireDigit = identitySettings.RequireDigit;
        options.Password.RequiredLength = identitySettings.RequiredLength;
        options.Password.RequireNonAlphanumeric = identitySettings.RequireNonAlphanumeric;
        options.Lockout.AllowedForNewUsers = identitySettings.LockoutAllowedForNewUsers;
    })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

    builder.Services.Configure<SecurityStampValidatorOptions>(options =>
    {
        options.ValidationInterval = TimeSpan.Zero;
    });

    builder.Services.ConfigureApplicationCookie(options =>
    {
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    });

    builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
    builder.Services.AddProblemDetails();

    builder.Services.AddLocalization(o => o.ResourcesPath = "Resources");

    // Switch to API Controllers instead of MVC Views
    builder.Services.AddControllers();

    // Swagger / OpenAPI
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    // Configure CORS for mobile emulator / web dev
    builder.Services.AddCors(options =>
    {
        options.AddPolicy(
            "MobileAppPolicy",
            policy =>
            {
                policy.SetIsOriginAllowed(origin => true) // Allow any origin in development
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials(); // Critical for Identity cookies!
            });
    });

    WebApplication app = builder.Build();

    await DataSeeder.SeedRolesAndAdminAsync(app.Services);

    var envLabel = app.Configuration["Environment:Label"] ?? "unknown";
    Log.Information(
        "Середовище: {EnvironmentLabel}",
        envLabel);

    // Configure the HTTP request pipeline
    app.UseExceptionHandler();
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();

        // Skip HTTPS Redirection for Development to allow HTTP Android Emulator connections
    }
    else
    {
        app.UseHsts();
        app.UseHttpsRedirection();
    }

    var localizationSettings = app.Configuration
        .GetSection(LocalizationSettings.Section)
        .Get<LocalizationSettings>() ?? new LocalizationSettings();

    app.UseRequestLocalization(options =>
    {
        options.SetDefaultCulture(localizationSettings.DefaultCulture)
               .AddSupportedCultures(localizationSettings.SupportedCultures)
               .AddSupportedUICultures(localizationSettings.SupportedCultures);
    });

    app.UseRouting();

    // Enable CORS right after routing and before Authentication!
    app.UseCors("MobileAppPolicy");

    // Add Authentication and Authorization
    app.UseAuthentication();
    app.UseAuthorization();

    // API Routes
    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Додаток завершився критичною помилкою під час запуску");
}
finally
{
    Log.CloseAndFlush();
}