export const validateVariants = (value, helpers) => {
    try {
        const parsed = JSON.parse(value);
        console.log({ parsed })

        if (!Array.isArray(parsed)) {
            return helpers.message("Variants must be an array of objects");
        }

        parsed.forEach((variant, index) => {
            if (
                !variant.color ||
                !variant.size ||
                typeof variant.stock !== "number"
            ) {
                return helpers.message(
                    `Invalid variant format at index ${index}. Expected { color, size, stock:number }`
                );
            }
        });
        console.log({ value })
        return value; // valid
    } catch {
        return helpers.message("Variants must be a valid JSON string");
    }
};



// 🧾 Summary
// Step	What happens	Example
// 1. Client sends	variants as JSON string	'[{"color":"Red","size":"M","stock":10}]'
// 2. Joi validation	Checks string is valid JSON + each item has color, size, and numeric stock	✅ Pass
// 3. Controller	JSON.parse() converts it to an array	[{ color: "Red", size: "M", stock: 10 }]
// 4. Save to DB	Save actual array of variants	Stored properly