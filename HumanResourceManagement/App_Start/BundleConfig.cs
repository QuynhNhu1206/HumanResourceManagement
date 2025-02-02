﻿using System.Web;
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
                        "~/Scripts/jquery.validate*"));

            // Thêm bundle cho tệp JavaScript của bạn
            bundles.Add(new ScriptBundle("~/bundles/admin").Include(
                        "~/Content/js/admin.js"));
            bundles.Add(new ScriptBundle("~/bundles/main").Include(
                        "~/Content/js/main.js"));
            bundles.Add(new ScriptBundle("~/bundles/option").Include(
                        "~/Content/js/option.js"));
            bundles.Add(new ScriptBundle("~/bundles/updateInfor").Include(
                        "~/Content/js/updateInfor.js"));
            bundles.Add(new ScriptBundle("~/bundles/phongban").Include(
                       "~/Content/js/phongban.js"));
            bundles.Add(new ScriptBundle("~/bundles/hd").Include(
                       "~/Content/js/hd.js"));
            bundles.Add(new ScriptBundle("~/bundles/llv").Include(
                       "~/Content/js/llv.js"));
            bundles.Add(new ScriptBundle("~/bundles/luong").Include(
                       "~/Content/js/luong.js"));
            bundles.Add(new ScriptBundle("~/bundles/changepass").Include(
                       "~/Content/js/changepass.js"));
            bundles.Add(new ScriptBundle("~/bundles/login").Include(
                       "~/Content/js/login.js"));
            bundles.Add(new ScriptBundle("~/bundles/alert").Include(
                       "~/Content/js/alert.js"));
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
