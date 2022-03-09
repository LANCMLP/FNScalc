// Use this document in order to edit the content of the results tabs. This content is published via a separate file, publish-results.js.
// Do not edit publish-results.js.

// Instructions on How to Write in this Document:

// Any line that begins with "//" will not show up in the code, and will be colored green if editing in VSCode. Use this is to leave notes or comments without publishing.

// To add content, you need some basic knowledge of HTML tags. This is outlined below:

// To add a heading, place text in between the tags <h3></h3>. You can use any number (h2, h3, h4) for different weights, but right now all headings in the results are consistently <h3>.
// To skip a line, use a single <br /> tag where you want the space. Pressing enter and writing on the next line without this tag *does not* create a new line in the published text.
// To start a bulleted list, use the tags <ul></ul> (unordered list) around the whole list, and put each bullet between <li></li>. Line breaks around lists are automatic.
// To start a numbered list, use the tags <ol></ol> (ordered list) around the whole list, and put each bullet between <li></li>. Line breaks around lists are automatic.
// To make text bold, place <b></b> around it. Similarly, to make it italic, place <i></i> around it.
// To add a link, use the following format: <a href="paste the url between quotes here">Write Text of Your Link Here</a>

// Each "const" below is a constant that stores the text for the results tab.
// IMPORTANT: As you see below, each entry has to start and end with a backtick (`). This is on the same keyboard key as the tilda (~).
// Adding a new constant does not create a new tab. This would need to be coded. But you can use this form to change existing result tab content as you please.

// WIC TAB

function results_tabs_text() {
  return {
    WIC_results_text: `My new publishing system works!`,

    // Know Your Rights Tab

    know_your_rights_text: `<h3>Right to Apply</h3> 

You have the right to apply for food stamps benefits. DSS cannot discourage you from applying or refuse to let you apply. DSS also must make translated materials available so that you can apply if you don't speak English.
<br>
<h3>Right to a Representative</h3>

You don't have to apply for food stamps yourself. You have the right to have am authorized representative apply on your behalf.

<h3>Right to Appeal</h3>

If your application for food stamps is denied, you have the right to appeal. You should receive a notice from DSS explaining their decision, and it will include an appeal deadline. You have 60 days from the date on this notice to let DSS know that you are appealing.
<br>
You also have the right to appeal if your amount of benefits is reduced, your benefits are terminated, or if DSS takes some negative action against you (like seeking a fraud or overpayment claim).
<br>
There are multiple levels of appeal. The initial appeal involves a hearing at your local DSS office where they will explain their decision. You will have the opportunity to provide evidence and to testify.
<br>
If you appeal, you and your representative have the right to see DSS' records about your food stamps claim beforehand.
<h3>Your Right to an Attorney</h3>

You have the right to an attorney to assist you with any food stamps appeal. If you receive a denial, termination, reduction, or other negative action from DSS, you can contact Legal Aid of North Carolina to apply for free legal assistance with your appeal.`,

    // Immigration Info Tab

    immigration_text: `Not everyone in the household has to be a citizen or have some type of legal immigration status in order to get food stamps, but anyone who is receiving the benefit must.
If there are members of the household who do not have legal immigration status, DSS will count their income, but will not count them as part of the FNS household. 
That means that they will be excluded from the calculation of the amount of benefits that the household receives.
<br>
<br>
For example, let's say Mary does not have a legal immigration status, but her daughter Sally was born in the U.S. and is a citizen.
Mary can apply to get FNS benefits for Sally, assuming the family meets all other requirements. 
DSS will count Mary's income in the calculation, but the benefit amount would be for a household size of 1.
If Mary were to earn citizenship or some other legal immigration status, the household size would increase to 2, and the family's benefit amount would increase.
<br>
<h3>Types of "Lawfully Present" Non-Citizens Who Can Get Food Stamps:</h3>
<ul>
  <li>Legal permanent residents (commonly known as "green card" holders</li>
  <li>Recognized refugees and conditional entrants</li>
  <li>Those granted asylum in the U.S.</li>
  <li>Those with deportation withheld</li>
  <li>Non-citizens who are victims of domestic violence, and who have filed a Violence Against Women Act (VAWA) petition</li>
  <li>Certified victims of human trafficking</li>
  <li>Qualified parolees</li>
</ul>
In some cases, immigrants may need to be living in the United States for five years before receiving FNS benefits.
Notably, common exceptions include:
<ul>
  <li>Children brought to the U.S. before age 18</li>
  <li>Those with deportation withheld</li>
  <li>Those granted aslyum</li>
  <li>Human trafficking victims</li>
  <li>Legal permanent residents with military ties</li>
</ul>
For more information on immigration requirements to get food stamps and the documents required, see <a href="https://policies.ncdhhs.gov/divisional/social-services/food-and-nutrition-services/policy-manuals/fss227.pdf">Section 227 of the NCDHHS FNS Manual.</a>`,

    // ABAWD and Work Requirements Info Tab

    ABAWD_text: `<h3>What Are Work Requirements and ABAWD?</h3>
                      
Food stamps has two sets of work-related requirements: "work requirements" and "ABAWD" (Able-Bodied Adult Without Dependents) requirements. 
Although these are technically two separate requirements, food stamps beneficiaries generally satisfy them both with the same activities. 

<br> 
<br>
Therefore this section will treat them as one and refer to them both as "work requirements."
<br/>
<h3>Work requirements apply to members of food stamps households who meet the following conditions:</h3>
<ul>
<li>Are between the ages of 18 and 49</li>
<li>Are deemed "fit for employment" by DSS</li>
<li>Are not living in a food stamps household with a minor that they are responsible for</li>
<ul><li>Note: This does not apply if the person subject to work requirements is not responsible for the child or the child is ineligible for food stamps</li></ul>
<li>Are not pregnant</li>
<li>Are not covered by various exemptions</li>
</ul>
If work requirements apply to someone in the food stamps household, they can only be included in the household for three months of every three years unless they meet the requirements.
<br/>
For example, if John was age 25, could work, and did not meet the work requirements, he could be included in a food stamps household for March, April, and May of 2022. Unless he meets the work requirements, he then would have to be excluded from the household until May of 2025. During this time, John's income would still count in the benefits calculation for the household, but the household's benefit amount would be lower because John would not be included in the household size.
<br/>
<h3>These work requirements are met if the individual does any of the following:</h3>
<ul>
<li>Works at least 20 hours per week</li>
<li>Works an average of 80 hours in a month</li>
<li>Participates in and complies with the requirements of a work program for 20 or more hours a week</li>
<li>Participates in and complies with the requirements of a workfare program (North Carolina does not operate workfare program at this time)</li>
</ul>
<br/>
These requirements can be met by working for an employer or being self-employed. In addition, they can be satisfied by some workforce training activities.
<br/>
<h3>The exceptions to work requirements are:</h3>
<ul>
<li>Being under age 18 or over age 50</li>
<li>Pregnancy</li>
<ul><li>Note: Once a child is born and lives in the parent's household, work requirements no longer apply to the parent</li></ul>
<li>Being medically certified as physically or mentally unfit for employment (disability or alcohol/drug dependence), or verifiably unfit based on the observation of the DSS caseworker</li>
<li>Homelessness</li>
<li>Being a caretaker for someone who is incapacitated</li>
<li>Bring over 18 and enrolled in school at least half of the time</li>
<li>Applying for and receiving Unemployment Benefits</li>
<ul><li>Note: These benefits also come with job search requirements that must be completed in order to keep both unemployment and food stamps benefits</li></ul>
<li>Residing in an area in which the requirements were waived (such as for COVID-19)</li>
<li>Participating in a refugee resettlement program</li>
<li>Receiving a waiver from DSS that allows you to receive food stamps for an extra three months after failing to meet the requirements</li>
</ul>
<br/>
As you can see, there are many situations in which individuals are exempt from work requirements. 
<br/>
<br/>
<b>If you are denied food stamps because you have not met some work requirements and believe this is in error, you should contact Legal Aid of North Carolina using the link at the bottom of this page.</b>`,

    // Info for Advocates Tab

    advocate_info_text: `"Food stamps," or FNS (as it is called in NC), is our local variant of the federal program SNAP. 
Thus, there are various sources of law that are relevant when diagnosing an FNS issue, all which have varying levels of authority.
This includes federal statute, regulation, and guidance, as well as state statute, regulations, and guidance (the FNS manual).
This section will highlight notable portions of that law as to make this process easier.

<h3>The FNS Manual</h3>
The FNS manual is the lowest on the heirarchy of authorities for FNS, yet it is perhaps the most used.
This is the document that guides DSS caseworkers' day-to-day decisions on FNS applicants and beneficiaries.
This manual impliments the various laws and regulations that sit above it into policies and practices for DSS to follow.
As such, it also must be consistent with those laws and regulations.
This, of course, is often but not always the case. 
<br />
The manual should be your starting point, but by no means your end point, in diagnosing a question of law related to FNS.
You can find the most recent version of the FNS manual on the NCDHHS website here.
It can be updated throughout the year, but most of the time significant changes come in the fall.

<h4>Notable portions of the FNS Manual include (but are definitely not limited to):</h4>
<ul>
  <li><a href="https://policies.ncdhhs.gov/divisional/social-services/food-and-nutrition-services/policy-manuals/fns-300-sources-of-income.pdf">FNS 300</a>, which details how various sources of income are counted</li>
  <li><a href="https://policies.ncdhhs.gov/divisional/social-services/food-and-nutrition-services/policy-manuals/fns-350-whose-income-is-counted.pdf">FNS 350</a>, which details whose income is counted</li>
  <li><a href="https://policies.ncdhhs.gov/divisional/social-services/food-and-nutrition-services/policy-manuals/fss710.pdf">FNS 710</a>, which governs administrative disqualification hearings</li>
  <li><a href="https://policies.ncdhhs.gov/divisional/social-services/food-and-nutrition-services/policy-manuals/fss810.pdf">FNS 810</a>,<a href="https://policies.ncdhhs.gov/divisional/social-services/food-and-nutrition-services/policy-manuals/fss815.pdf">815</a>, and <a href="https://policies.ncdhhs.gov/divisional/social-services/food-and-nutrition-services/policy-manuals/fss820.pdf">820</a>, which detail the different types of claims that DSS can bring against beneficiaries who are accused of running afoul of program rules</li>
</ul>

<h3>State Statute and Regulations</h3>
NC state law that governs FNS can be found at 

<h3>Federal Guidance on SNAP</h3>
USDA SNAP guidance can be found at

<h3>Federal Law and Regulations on SNAP</h3>
Federal law and regs on SNAP can be found at`,
  };
}
