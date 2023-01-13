var nodemailer = require("nodemailer");

module.exports.contactUs = async (req, res) => {
  const { name, email, message } = req.body;
  try {
		const mailOptions = {
			from: name,
			to: "clanicehktriglav@gmail.com",
			subject: "New message from ORLICE Website",
			html:
				`<p>Name: ${name}</p>
				<p>Email: ${email}</p>
				<p>Message: ${message}</p>`
		};
		
  	const contactEmail = nodemailer.createTransport({
  	  service: "gmail",
  	  auth: {
  	    user: process.env.EMAIL,
  	    pass: process.env.WORD,
  	  },
  	});

		contactEmail.verify((error) => {
			if (error) {
				console.log(error);
			} else {
				console.log("Ready to Send");
			}
		});

  	contactEmail.sendMail(mailOptions, function (error, info) {
  	  if (error) {
  	    console.log(error);
  	  } else {
  	    console.log("Email sent: " + info.response);
  	  }
  	});
  
} catch (error) {}
};