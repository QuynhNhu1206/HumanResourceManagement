using System.Web;
using System.Web.Optimization;

namespace HumanResourceManagement
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Content/jquery.validate*"));

            // Thêm bundle cho tệp JavaScript của bạn
            bundles.Add(new ScriptBundle("~/bundles/admin").Include(
                        "~/Content/js/admin.js"));
            bundles.Add(new ScriptBundle("~/bundles/main").Include(
                        "~/Content/js/main.js"));
            bundles.Add(new ScriptBundle("~/bundles/option").Include(
                        "~/Content/js/option.js"));
            bundles.Add(new ScriptBundle("~/bundles/updateInfor").Include(
                        "~/Content/js/updateInfor.js"));
            bundles.Add(new ScriptBundle("~/bundles/pb").Include(
                       "~/Content/js/pb.js"));
            // Các bundle hiện có
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new Bundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"
                      )); ;
        }
    }
}
