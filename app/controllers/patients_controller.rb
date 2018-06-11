class PatientsController < ApplicationController
	before_action :set_patient, only: [:show, :edit, :update, :destroy]

	# GET /patients
	# GET /patients.json
	def find_job
	@url=params[:ide]
	if File.exist?("#{Rails.root}/public/#{@url}/index.html")
	@a||= Dir.glob("#{Rails.root}/public/#{@url}/gsea_report_for_na_pos_*.xls")
	@a1 =@a.to_s.delete('[]')
	@a2 =@a1.delete('""')
	@target||= File.read(@a2)
	@target1= CSV.parse(@target, :headers => true, :col_sep => "\t")
	redirect_to "/#{@url}"
	#@target= "results/#{@job}/gsea_report_for_na_pos*"
	##render :file => "/home/rmartin/preditest/results/fe30a8b3-b5ee-4afc-b336-33b64bbcc873/gsea_report_for_na_pos_1467200995861.html"
	else 
		redirect_to "/error"
	end
end

	def index
		@patients = Patient.all
	end

	# GET /patients/1
	# GET /patients/1.json
	def show
	require 'spreadsheet'	
	require 'csv'
	require 'nokogiri'

	@job=params[:id]
	@ide=params[:job]
	puts "Mi job id #{@job}"
	 
	system("mv #{Rails.root}/public/$(ls -t #{Rails.root}/public  | head -1) #{Rails.root}/public/#{@job}")
	
	if File.exist?("#{Rails.root}/public/#{@job}/index.html")
    @a||= Dir.glob("#{Rails.root}/public/#{@job}/gsea_report_for_na_pos_*.xls")
    @a1 =@a.to_s.delete('[]')
    @a2 =@a1.delete('""')
    @target||= File.read(@a2)
    @target1= CSV.parse(@target, :headers => true, :col_sep => "\t")
    puts "#{@target1.class}"

    @twofiles = Dir["#{Rails.root}/public/#{@job}/gsea_report_for_*.xls"]
    @twofiles_data = @twofiles.map {|tf| CSV.read(tf)}


    @csv_string = CSV.generate do |csv|
    csv << @target1.headers
    @twofiles_data.each do |data|
    data.shift
    data.each do |row|
    csv << row
end
end
end
#@data||= File.read(@csv_string)
@data2 = CSV.parse(@csv_string, :headers => true, :col_sep => "\t")

	##redirect_to "/#{@job}"
	#@target= "results/#{@job}/gsea_report_for_na_pos*"
	##render :file => "/home/rmartin/preditest/results/fe30a8b3-b5ee-4afc-b336-33b64bbcc873/gsea_report_for_na_pos_1467200995861.html"
	else 
		redirect_to "/error"
	end
end

	# GET /patients/new
	def new
	end

	def home
	end

	def search
	end

	# GET /patients/1/edit
	def edit
	end

	# POST /patients
	# POST /patients.json
	def create
			require 'securerandom'
	 @job= SecureRandom.uuid
	ids_up= params[:ids_up]
	name=params[:name]
	organism=params[:organism]
	@list= ids_up.split('\n')
	File.open("testA.rnk", "w") do |file|
	@list.each do |v|	
	file.puts (v)


end
end

	 tar = File.open("testA.rnk").readlines.size

if (tar < 250)&&(tar >= 150)
        v=0
	File.open("testA.rnk", "a+") do |f| 
 	(1..2500).each do |i|
 	f.puts("CACA#{v}	0.1")
	v= v +1
	f.puts("CACA#{v}	-0.1")
	v= v +1	
end 
end
elsif (tar < 150)&&(tar > 35)
	v=0
	File.open("testA.rnk", "a+") do |f| 
 	(1..1250).each do |i|
 	f.puts("CACA#{v}	0.1")
	v= v +1
	f.puts("CACA#{v}	-0.1")
	v= v +1	
end
end
elsif (tar < 650)&&(tar >= 250)
	v=0
	File.open("testA.rnk", "a+") do |f| 
 	(1..3750).each do |i|
  f.puts("CACA#{v}	0.1")
	v= v +1
	f.puts("CACA#{v}	-0.1")
	v= v +1	
end
end
elsif (tar < 1500)&&(tar >= 650)
	v=0
	File.open("testA.rnk", "a+") do |f| 
 	(1..5000).each do |i|
 f.puts("CACA#{v}	0.1")
	v= v +1
	f.puts("CACA#{v}	-0.1")
	v= v +1	
end
end
end




		require 'open3'
			if organism == "Homo_sapiens"
		  system("java -cp gsea2-2.2.2.jar -Xmx1024m xtools.gsea.GseaPreranked -gmx #{Rails.root}/NutriGeneset.gmt -collapse false -mode Max_probe -norm meandiv -nperm 1000 -rnk #{Rails.root}/testA.rnk -scoring_scheme weighted -rpt_label preditest_analysis -include_only_symbols true -make_sets true -plot top_x_20 -rnd_seed timestamp -set_max 1000 -set_min 1 -zip_report false -out #{Rails.root}/public") 
			
			else
			system("gseapy prerank -r test.rnk -g NutriGeneset.gmt -o results/#{@job} --min-size 0 --max-size 100000")
		 end
	
	

		 redirect_to "/patients/#{@job}"

	end

	def enrichment
		nombreArchivo  = params[:archivo1]
		job = params[:job]

		if File.exist?("#{Rails.root}/public/#{@job}/#{nombreArchivo}_genes.xls")
		system("#{Rails.root}/app/assets/enrichment.sh \"#{Rails.root}/public/#{job}/#{nombreArchivo}_genes.xls\" > temporal.txt")
		

		else
		require 'csv'
		tar1= File.read("#{Rails.root}/public/#{job}/#{nombreArchivo}.xls")
        archivo=CSV.parse(tar1, :headers => true, :col_sep => "\t")
        archivo1=archivo["PROBE"]
  	    File.open("#{Rails.root}/public/#{job}/#{nombreArchivo}_genes.xls", "w") do |file1|
	    archivo1.each do |vt|	
	    file1.puts (vt)
	end
	end
		system("#{Rails.root}/app/assets/enrichment.sh \"#{Rails.root}/public/#{job}/#{nombreArchivo}_genes.xls\" > temporal.txt")
					
	end
send_file "temporal.txt", filename: "#{nombreArchivo}_geneFunction.txt", type: "application/csv"
end	
	def download
		require 'csv'

		 nombreArchivo  = params[:archivo1]
		 job = params[:job]

  tar1= File.read("#{Rails.root}/public/#{job}/#{nombreArchivo}.xls")

  archivo=CSV.parse(tar1, :headers => true, :col_sep => "\t")
  archivo1=archivo["PROBE"]
  	File.open("#{Rails.root}/public/#{job}/#{nombreArchivo}_genes.xls", "w") do |file1|
	archivo1.each do |vt|	
	file1.puts (vt)

end
end
		#render file: "prueba.xls", layout: false, content_type: "application/force-download"
		send_file "#{Rails.root}/public/#{job}/#{nombreArchivo}_genes.xls", filename: "#{Rails.root}/public/#{job}/#{nombreArchivo}_genes.xls", type: 'application/xls'
	end


	# PATCH/PUT /patients/1
	# PATCH/PUT /patients/1.json
	def update
		respond_to do |format|
			if @patient.update(patient_params)
				format.html { redirect_to @patient, notice: 'Patient was successfully updated.' }
				format.json { render :show, status: :ok, location: @patient }
			else
				format.html { render :edit }
				format.json { render json: @patient.errors, status: :unprocessable_entity }
			end
		end
	end

	# DELETE /patients/1
	# DELETE /patients/1.json
	def destroy
		@patient.destroy
		respond_to do |format|
			format.html { redirect_to patients_url, notice: 'Patient was successfully destroyed.' }
			format.json { head :no_content }
		end
	end

	private
		# Use callbacks to share common setup or constraints between actions.
		def set_patient
			require 'securerandom'
		id1= SecureRandom.uuid
			if File.exist?("results/#{@name}/gseapy_reports.csv")
		redirect_to "/#{id1}"
		end
end

		# Never trust parameters from the scary internet, only allow the white list through.
		def patient_params
			params.require(:patient).permit(:age, :gender, :weight, :city, :number_of)
		end

end
