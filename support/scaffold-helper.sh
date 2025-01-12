#!/bin/bash

#
# Scaffold helper
#
# Scaffold a new helper for the helper library, creating basic versions of
# the files required to get up and running quickly.
#
# Usage: ./support/scaffold-helper.sh <helper-name> --folder [folder-name]
#
# Parameters:
#   <helper-name>  (required)
#     The name of the helper in kebab-case.
#   --folder [folder-name]  (required)
#     The name of the folder where the helper will reside (e.g. array)
#
# Example:
#   ./support/scaffold-helper.sh round --folder number
#
# Recommended alias:
#   scaffold:helper
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/colours.sh"

if [ -z "$1" ]; then
	echo -e "\nPlease provide a ${BLUE}helper-name${RESET_COLOUR} for the helper."
	echo -e "Usage: ${PURPLE}./support/scaffold-helper.sh${RESET_COLOUR} ${BLUE}<helper-name>${RESET_COLOUR} --folder <folder-name>"
	exit 1
fi

if [ -z "$2" ]; then
	echo -e "\nPlease provide a ${BLUE}folder-name${RESET_COLOUR} for the type of helper this is."
	echo -e "Usage: ${PURPLE}./support/scaffold-helper.sh${RESET_COLOUR} <helper-name> ${BLUE}--folder <folder-name>${RESET_COLOUR}"
	exit 1
fi

# Determine the passed parameters
HELPER_NAME="$1"
shift

FOLDER_PATH=""

while [[ "$#" -gt 0 ]]; do
	case $1 in
		--folder)
			FOLDER_PATH="$2"
			shift
			;;
		*)
			echo -e "\nUnknown parameter passed: $1"
			echo -e "Usage: ${PURPLE}./support/scaffold-helper.sh${RESET_COLOUR} ${BLUE}<helper-name>${RESET_COLOUR} --folder <folder-name>"
			exit 1
			;;
	esac
    shift
done

# The base path is where the helper will be created.
BASE_PATH="lib/$FOLDER_PATH"

cd "$BASE_PATH"

# Generate our scaffold files from templates.
templates=(
	"helper.js"
	"helper.test.js"
)

output_files=(
	"${HELPER_NAME}.js"
	"${HELPER_NAME}.test.js"
)

for i in "${!templates[@]}"; do
	TEMPLATE_FILE="$SCRIPT_DIR/templates/${templates[$i]}"
	OUTPUT_FILE="${output_files[$i]}"

	sed "s/{{HELPER_NAME}}/$HELPER_NAME/g" "$TEMPLATE_FILE" > "$OUTPUT_FILE"

	code -r $OUTPUT_FILE
done

# Print the success message
echo -e "\nHelper ${PURPLE}$HELPER_NAME${RESET_COLOUR} scaffolded successfully in ${BLUE}$BASE_PATH/$HELPER_NAME${RESET_COLOUR}.\n"
echo -e "${PURPLE}$HELPER_NAME${RESET_COLOUR}"
echo "  ↳ $HELPER_NAME.js"
echo "  ↳ $HELPER_NAME.test.js"
