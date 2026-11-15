exports.loginAs=async(page,user='Ayu')=>{
 await page.locator('#login-form').waitFor();
 await page.locator(`[data-demo-user="${user}"]`).click();
 await page.getByRole('button',{name:'Masuk',exact:true}).click();
 await page.locator('.account-menu summary').waitFor();
};
exports.switchAccount=async(page,user)=>{
 await page.locator('.account-menu summary').click();
 await page.getByRole('button',{name:'Keluar akun',exact:true}).click();
 await exports.loginAs(page,user);
};
