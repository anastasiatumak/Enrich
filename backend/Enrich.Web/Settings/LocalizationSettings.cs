namespace Enrich.WebAPI.Settings
{
    public class LocalizationSettings
    {
        public const string Section = "Localization";

        public string DefaultCulture { get; set; } = "en";

        public string[] SupportedCultures { get; set; } = ["uk", "en"];
    }
}
